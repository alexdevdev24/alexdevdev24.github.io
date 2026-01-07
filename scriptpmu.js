/**
 * scriptpmu.js
 * Version Corrigée : Export JSON renforcé
 */

// CONFIGURATION
const PROXY_URL = 'https://corsproxy.io/?';
const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

// ÉTAT GLOBAL
let globalExtractedData = null;

// ATTENTE DU CHARGEMENT DE LA PAGE
document.addEventListener('DOMContentLoaded', () => {
    
    // Récupération sécurisée des éléments DOM
    const dom = {
        date: document.getElementById('dateInput'),
        reunion: document.getElementById('reunionInput'),
        btnFetch: document.getElementById('fetchBtn'),
        btnExport: document.getElementById('exportBtn'),
        status: document.getElementById('status'),
        results: document.getElementById('resultsContainer')
    };

    // Vérification que les éléments existent
    if (!dom.btnFetch || !dom.btnExport) {
        console.error("Erreur critique : Boutons introuvables dans le HTML");
        return;
    }

    // --- EVENEMENTS ---

    // 1. Clic sur "Charger"
    dom.btnFetch.addEventListener('click', async () => {
        const date = dom.date.value.trim();
        const reunionStr = dom.reunion.value.trim().toUpperCase();
        const reunionNum = reunionStr.replace(/\D/g, ''); 

        if (!date || !reunionNum) {
            showStatus(dom, 'Veuillez renseigner la date (ex: 07012026) et la réunion (ex: R1).', 'error');
            return;
        }

        setLoading(dom, true);
        
        globalExtractedData = { 
            meta: { 
                date: date, 
                reunion: reunionStr, 
                source: "PMU Online Client 1",
                generated_at: new Date().toISOString() 
            }, 
            courses: [] 
        };

        try {
            // Récupération Programme
            const urlProg = `${API_BASE}/${date}/R${reunionNum}`;
            const progData = await fetchWithProxy(urlProg);

            if (!progData.courses || progData.courses.length === 0) {
                throw new Error("Aucune course trouvée. Vérifiez la date.");
            }

            // Récupération Détails (Parallèle)
            const promises = progData.courses.map(course => processCourse(date, reunionNum, course));
            globalExtractedData.courses = await Promise.all(promises);

            // Tri
            globalExtractedData.courses.sort((a, b) => a.num_course - b.num_course);

            // Affichage
            renderResults(dom, globalExtractedData.courses);
            showStatus(dom, `${globalExtractedData.courses.length} courses chargées avec succès.`, 'success');
            
            // Afficher le bouton Export
            dom.btnExport.style.display = 'inline-block';

        } catch (error) {
            console.error(error);
            showStatus(dom, `Erreur : ${error.message}`, 'error');
            dom.btnExport.style.display = 'none';
        } finally {
            setLoading(dom, false);
        }
    });

    // 2. Clic sur "Télécharger JSON"
    dom.btnExport.addEventListener('click', () => {
        if (!globalExtractedData) {
            alert("Aucune donnée à télécharger. Veuillez d'abord charger une réunion.");
            return;
        }

        try {
            const fileName = `PMU_${globalExtractedData.meta.date}_${globalExtractedData.meta.reunion}.json`;
            const dataStr = JSON.stringify(globalExtractedData, null, 2);
            
            // Création du Blob avec encodage UTF-8
            const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
            
            // Création du lien de téléchargement temporaire
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            
            // Ajout au DOM, clic, et nettoyage (Compatible Firefox/Chrome)
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Libération mémoire
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
        } catch (e) {
            console.error("Erreur Export:", e);
            alert("Erreur lors de la création du fichier : " + e.message);
        }
    });

});

/**
 * Traite une course individuelle
 */
async function processCourse(date, reunionNum, courseInfo) {
    const cNum = courseInfo.numOrdre;
    
    // URLs
    const urlParticipants = `${API_BASE}/${date}/R${reunionNum}/C${cNum}/participants`;
    const urlRapports = `${API_BASE}/${date}/R${reunionNum}/C${cNum}/rapports-definitifs`;

    // Fetch Parallèle
    const [partantsData, rapportsData] = await Promise.all([
        fetchWithProxy(urlParticipants).catch(e => ({ participants: [] })),
        fetchWithProxy(urlRapports).catch(e => null)
    ]);

    // Formatage Participants
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
        rapports: rapportsData
    };
}

/**
 * Proxy Wrapper
 */
async function fetchWithProxy(targetUrl) {
    const finalUrl = PROXY_URL + encodeURIComponent(targetUrl);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
        if(response.status === 404) return {}; 
        throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
}

// --- FONCTIONS UI ---

function renderResults(dom, courses) {
    dom.results.innerHTML = '';
    
    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'race-card';
        
        const arriveeTxt = course.ordre_arrivee.length > 0 ? course.ordre_arrivee.join(' - ') : 'En cours';

        div.innerHTML = `
            <div class="race-header">
                <span>C${course.num_course} - ${course.nom}</span>
                <span>${new Date(course.heure_depart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div class="race-content">
                <div class="race-meta">
                    <strong>Discipline:</strong> ${course.discipline} | 
                    <strong>Partants:</strong> ${course.participants.length}
                </div>
                <div style="margin-top:5px; color:#0056b3;">
                    <strong>Arrivée:</strong> ${arriveeTxt}
                </div>
                <details style="margin-top:10px;">
                    <summary>Voir les participants (Premier: ${course.participants[0]?.nom || '?'})</summary>
                    <div>
                        ${course.participants.map(p => `
                            <div>
                                <strong>${p.numero}</strong> ${p.nom} 
                                <span style="color:#666; font-size:0.9em;">(${p.musique})</span> 
                                <span style="float:right; font-weight:bold;">${p.cote || '-'}</span>
                            </div>
                        `).join('')}
                    </div>
                </details>
            </div>
        `;
        dom.results.appendChild(div);
    });
}

function showStatus(dom, msg, type) {
    dom.status.style.display = 'block';
    dom.status.className = `status-${type}`;
    dom.status.innerText = msg;
}

function setLoading(dom, isLoading) {
    dom.btnFetch.disabled = isLoading;
    dom.date.disabled = isLoading;
    dom.reunion.disabled = isLoading;
    
    if (isLoading) {
        showStatus(dom, 'Chargement en cours...', 'loading');
        dom.results.innerHTML = '';
        dom.btnExport.style.display = 'none'; // On cache le bouton pendant le chargement
    }
}
