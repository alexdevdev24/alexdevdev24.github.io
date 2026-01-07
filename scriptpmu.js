/**
 * scriptpmu.js
 * Fonctionnalités : Proxy CORS, API Online (Client 1), Rapports détaillés, Musique, Export JSON.
 */

const PROXY_URL = 'https://corsproxy.io/?';
const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

// Stockage global pour l'export
let globalExtractedData = null;

document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        date: document.getElementById('dateInput'),
        reunion: document.getElementById('reunionInput'),
        btnFetch: document.getElementById('fetchBtn'),
        btnExport: document.getElementById('exportBtn'),
        status: document.getElementById('status'),
        results: document.getElementById('resultsContainer')
    };

    if (!dom.btnFetch) return;

    // --- 1. CHARGEMENT DES DONNÉES ---
    dom.btnFetch.addEventListener('click', async () => {
        const date = dom.date.value.trim();
        const reunionStr = dom.reunion.value.trim().toUpperCase();
        const reunionNum = reunionStr.replace(/\D/g, ''); 

        if (!date || !reunionNum) {
            showStatus(dom, 'Format invalide. Utilisez Date: JJMMAAAA et Réunion: R1', 'error');
            return;
        }

        setLoading(dom, true);
        
        // Reset data
        globalExtractedData = { 
            meta: { date, reunion: reunionStr, generated_at: new Date().toISOString() }, 
            courses: [] 
        };

        try {
            // A. Programme
            const urlProg = `${API_BASE}/${date}/R${reunionNum}`;
            const progData = await fetchWithProxy(urlProg);

            if (!progData.courses || progData.courses.length === 0) throw new Error("Aucune course trouvée.");

            // B. Détails (Parallèle)
            const promises = progData.courses.map(course => processCourse(date, reunionNum, course));
            globalExtractedData.courses = await Promise.all(promises);
            
            // Tri par numéro de course
            globalExtractedData.courses.sort((a, b) => a.num_course - b.num_course);

            // C. Rendu
            renderResults(dom, globalExtractedData.courses);
            showStatus(dom, `${globalExtractedData.courses.length} courses chargées avec succès.`, 'success');
            dom.btnExport.style.display = 'inline-block';

        } catch (error) {
            console.error(error);
            showStatus(dom, `Erreur : ${error.message}`, 'error');
            dom.btnExport.style.display = 'none';
        } finally {
            setLoading(dom, false);
        }
    });

    // --- 2. EXPORT JSON ---
    dom.btnExport.addEventListener('click', () => {
        if (!globalExtractedData) return;
        const fileName = `PMU_${globalExtractedData.meta.date}_${globalExtractedData.meta.reunion}.json`;
        const blob = new Blob([JSON.stringify(globalExtractedData, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });
});

/**
 * Récupère les données d'une course spécifique (Participants + Rapports)
 */
async function processCourse(date, reunionNum, courseInfo) {
    const cNum = courseInfo.numOrdre;
    
    // On appelle Participants et Rapports en parallèle pour aller plus vite
    const [partantsData, rapportsData] = await Promise.all([
        fetchWithProxy(`${API_BASE}/${date}/R${reunionNum}/C${cNum}/participants`).catch(() => ({ participants: [] })),
        fetchWithProxy(`${API_BASE}/${date}/R${reunionNum}/C${cNum}/rapports-definitifs`).catch(() => null)
    ]);

    // Nettoyage des participants
    const participantsPropres = (partantsData.participants || []).map(p => ({
        numero: p.numPmu,
        nom: p.nomCheval,
        driver: p.driver || p.jockey,
        entraineur: p.entraineur,
        musique: p.musique,
        cote: p.dernierRapportDirect ? p.dernierRapportDirect.rapport : null
    }));

    return {
        id: `R${reunionNum}C${cNum}`,
        num_course: cNum,
        nom: courseInfo.libelle,
        discipline: courseInfo.discipline,
        heure_depart: courseInfo.heureDepart,
        ordre_arrivee: courseInfo.ordreArrivee || [],
        participants: participantsPropres,
        rapports: rapportsData // On garde l'objet complet pour le JSON
    };
}

// --- RENDU HTML ---

function renderResults(dom, courses) {
    dom.results.innerHTML = '';
    
    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'race-card';
        
        const arriveeTxt = course.ordre_arrivee.length > 0 ? course.ordre_arrivee.join(' - ') : 'Arrivée non disponible';
        const rapportsHtml = generateReportsHtml(course.rapports);

        div.innerHTML = `
            <div class="race-header">
                <span>C${course.num_course} - ${course.nom}</span>
                <span>${new Date(course.heure_depart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div class="race-content">
                <div class="race-meta">
                    <strong>Discipline:</strong> ${course.discipline} | 
                    <strong>Partants:</strong> ${course.participants.length} |
                    <strong>Arrivée:</strong> <span style="color:#d63384; font-weight:bold">${arriveeTxt}</span>
                </div>

                ${rapportsHtml}

                <details>
                    <summary>Voir les ${course.participants.length} partants (Musique & Cotes)</summary>
                    <div>
                        ${course.participants.map(p => `
                            <div class="p-row">
                                <strong>${p.numero}</strong> 
                                <span>${p.nom} <span style="color:#666; font-size:0.9em;">(${p.musique})</span></span>
                                <span style="font-weight:bold;">${p.cote || '-'}</span>
                            </div>
                        `).join('')}
                    </div>
                </details>
            </div>
        `;
        dom.results.appendChild(div);
    });
}

/**
 * Génère le tableau HTML des rapports financiers
 */
function generateReportsHtml(rapports) {
    if (!rapports || !Array.isArray(rapports)) return '<p style="color:#777; font-style:italic;">Rapports non disponibles.</p>';

    // Filtre des paris demandés
    const CIBLES = ['SIMPLE_GAGNANT', 'SIMPLE_PLACE', 'COUPLE_GAGNANT', 'COUPLE_PLACE', 'COUPLE_ORDRE', 'TRIO', 'TRIO_ORDRE', 'TIERCE', 'CLASSIC_TIERCE'];
    const paris = rapports.filter(r => CIBLES.some(c => r.typePari.includes(c)));

    if (paris.length === 0) return '<p style="color:#777; font-style:italic;">Aucun rapport définitif affichable.</p>';

    let html = '<table class="reports-table"><thead><tr><th>Type</th><th>Combinaison</th><th>Rapport (1€)</th></tr></thead><tbody>';

    paris.forEach(p => {
        let badgeClass = 'bg-couple'; // Defaut jaune
        let label = p.libelle || p.typePari;

        if (p.typePari.includes('GAGNANT')) badgeClass = 'bg-win';
        else if (p.typePari.includes('PLACE')) badgeClass = 'bg-place';
        else if (p.typePari.includes('TRIO') || p.typePari.includes('TIERCE')) badgeClass = 'bg-trio';

        p.rapports.forEach(r => {
            const gain = (r.dividendePourUnEuro / 100).toFixed(2);
            html += `
                <tr>
                    <td><span class="badge ${badgeClass}">${label}</span></td>
                    <td><b>${r.combinaison}</b></td>
                    <td style="color:#d63384; font-weight:bold;">${gain} €</td>
                </tr>`;
        });
    });

    html += '</tbody></table>';
    return html;
}

// --- UTILITAIRES ---

async function fetchWithProxy(targetUrl) {
    const finalUrl = PROXY_URL + encodeURIComponent(targetUrl);
    const response = await fetch(finalUrl);
    if (!response.ok) {
        if(response.status === 404) return {}; 
        throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
}

function showStatus(dom, msg, type) {
    dom.status.style.display = 'block';
    dom.status.className = `status-${type}`;
    dom.status.innerText = msg;
}

function setLoading(dom, isLoading) {
    dom.btnFetch.disabled = isLoading;
    if (isLoading) {
        showStatus(dom, 'Chargement des données Online...', 'loading');
        dom.results.innerHTML = '';
        dom.btnExport.style.display = 'none';
    }
}
