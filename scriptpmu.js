/**
 * scriptpmu.js
 * Version Corrigée : Utilise l'API Online (Client 1) pour garantir la présence des participants et de la musique.
 */

// Utilisation de corsproxy.io qui est plus stable pour le PMU
const PROXY_URL = 'https://corsproxy.io/?';

// ON BASCULE TOUT SUR LE CLIENT 1 (WEB) pour avoir les participants et la musique
const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

// ÉTAT GLOBAL
let globalExtractedData = null;

// ÉLÉMENTS DOM
const dom = {
    date: document.getElementById('dateInput'),
    reunion: document.getElementById('reunionInput'),
    btnFetch: document.getElementById('fetchBtn'),
    btnExport: document.getElementById('exportBtn'),
    status: document.getElementById('status'),
    results: document.getElementById('resultsContainer')
};

// INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    dom.btnFetch.addEventListener('click', handleFetch);
    dom.btnExport.addEventListener('click', handleExport);
});

/**
 * Gestionnaire principal
 */
async function handleFetch() {
    const date = dom.date.value.trim();
    const reunionStr = dom.reunion.value.trim().toUpperCase();
    const reunionNum = reunionStr.replace(/\D/g, ''); 

    if (!date || !reunionNum) {
        showStatus('Veuillez renseigner la date (JJMMAAAA) et la réunion (ex: R1).', 'error');
        return;
    }

    setLoading(true);
    
    // Initialisation de l'objet final
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
        // 1. Récupération du PROGRAMME (Liste des courses)
        // URL: .../programme/07012026/R1
        const urlProg = `${API_BASE}/${date}/R${reunionNum}`;
        const progData = await fetchWithProxy(urlProg);

        if (!progData.courses || progData.courses.length === 0) {
            throw new Error("Aucune course trouvée. Vérifiez la date et le numéro de réunion.");
        }

        // 2. Récupération des détails pour chaque course
        // On mappe toutes les promesses pour aller vite
        const promises = progData.courses.map(course => processCourse(date, reunionNum, course));
        
        globalExtractedData.courses = await Promise.all(promises);

        // Tri propre par numéro de course
        globalExtractedData.courses.sort((a, b) => a.num_course - b.num_course);

        // Affichage
        renderResults(globalExtractedData.courses);
        showStatus(`${globalExtractedData.courses.length} courses récupérées avec participants et musique.`, 'success');
        dom.btnExport.style.display = 'inline-block';

    } catch (error) {
        console.error(error);
        showStatus(`Erreur : ${error.message}`, 'error');
        dom.btnExport.style.display = 'none';
    } finally {
        setLoading(false);
    }
}

/**
 * Traite une course : récupère Participants (avec musique) et Rapports
 */
async function processCourse(date, reunionNum, courseInfo) {
    const cNum = courseInfo.numOrdre;
    
    // URLs ciblées sur le Client 1 (Online)
    const urlParticipants = `${API_BASE}/${date}/R${reunionNum}/C${cNum}/participants`;
    const urlRapports = `${API_BASE}/${date}/R${reunionNum}/C${cNum}/rapports-definitifs`;

    // Exécution parallèle
    const [partantsData, rapportsData] = await Promise.all([
        fetchWithProxy(urlParticipants).catch(e => ({ participants: [] })),
        fetchWithProxy(urlRapports).catch(e => null)
    ]);

    // Nettoyage des participants pour garder l'essentiel (dont la musique)
    const participantsPropres = (partantsData.participants || []).map(p => ({
        numero: p.numPmu,
        nom: p.nomCheval,
        driver: p.driver || p.jockey,
        entraineur: p.entraineur,
        musique: p.musique, // La musique est disponible ici sur le Client 1
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
 * Fonction Fetch via Proxy CORS
 */
async function fetchWithProxy(targetUrl) {
    // On encode l'URL cible pour passer proprement dans le proxy
    const finalUrl = PROXY_URL + encodeURIComponent(targetUrl);
    
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
        const text = await response.text();
        // On ignore les erreurs 404 courantes (ex: rapports pas encore dispos)
        if(response.status === 404) return {}; 
        throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
}

// --- FONCTIONS D'AFFICHAGE (UI) ---

function renderResults(courses) {
    dom.results.innerHTML = '';
    
    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'race-card';
        
        // Aperçu des 3 premiers favoris ou arrivés
        const countPartants = course.participants.length;
        const arriveeTxt = course.ordre_arrivee.length > 0 ? course.ordre_arrivee.join('-') : 'En cours';

        div.innerHTML = `
            <div class="race-header">
                <span>C${course.num_course} - ${course.nom}</span>
                <span>${new Date(course.heure_depart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div class="race-content">
                <div class="race-meta">
                    <strong>Discipline:</strong> ${course.discipline} | 
                    <strong>Partants:</strong> ${countPartants}
                </div>
                <div style="margin-top:5px; color:#0056b3;">
                    <strong>Arrivée:</strong> ${arriveeTxt}
                </div>
                <details style="margin-top:10px; font-size:0.9em;">
                    <summary>Voir les participants (Premier: ${course.participants[0]?.nom || '?'})</summary>
                    <div style="max-height: 200px; overflow-y: auto; background: #f1f1f1; padding: 5px;">
                        ${course.participants.map(p => `
                            <div><strong>${p.numero}</strong> ${p.nom} (${p.musique}) - Cote: ${p.cote || '-'}</div>
                        `).join('')}
                    </div>
                </details>
            </div>
        `;
        dom.results.appendChild(div);
    });
}

function showStatus(msg, type) {
    dom.status.style.display = 'block';
    dom.status.className = `status-${type}`; // status-loading, status-error, status-success
    dom.status.innerText = msg;
}

function setLoading(isLoading) {
    dom.btnFetch.disabled = isLoading;
    if (isLoading) {
        showStatus('Chargement des données Online... (Cela peut prendre quelques secondes)', 'loading');
        dom.results.innerHTML = '';
        dom.btnExport.style.display = 'none';
    }
}
