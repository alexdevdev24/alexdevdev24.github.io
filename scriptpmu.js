/**
 * scriptpmu.js
 * Logique d'extraction des données PMU avec gestion CORS via Proxy.
 */

// CONFIGURATION
// En production réelle, remplacez ceci par votre propre endpoint backend sécurisé.
const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const API_OFFLINE = 'https://offline.turfinfo.api.pmu.fr/rest/client/7/programme';
const API_ONLINE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

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
 * Gestionnaire principal de récupération des données
 */
async function handleFetch() {
    const date = dom.date.value.trim();
    const reunionStr = dom.reunion.value.trim().toUpperCase();
    const reunionNum = reunionStr.replace(/\D/g, ''); // Extrait "1" de "R1"

    if (!date || !reunionNum) {
        showStatus('Veuillez renseigner la date et le numéro de réunion.', 'error');
        return;
    }

    setLoading(true);
    globalExtractedData = { 
        meta: { date, reunion: reunionStr, generated_at: new Date().toISOString() }, 
        courses: [] 
    };

    try {
        // 1. Récupération du programme global de la réunion
        const urlProg = `${API_OFFLINE}/${date}/R${reunionNum}`;
        const progData = await fetchWithProxy(urlProg);

        if (!progData.courses || progData.courses.length === 0) {
            throw new Error("Aucune course trouvée pour cette date/réunion.");
        }

        // 2. Récupération parallèle des détails par course
        const promises = progData.courses.map(course => processCourse(date, reunionNum, course));
        
        // Attendre que toutes les requêtes soient terminées
        globalExtractedData.courses = await Promise.all(promises);

        // Tri par numéro de course
        globalExtractedData.courses.sort((a, b) => a.num_course - b.num_course);

        // Affichage
        renderResults(globalExtractedData.courses);
        showStatus(`${globalExtractedData.courses.length} courses chargées avec succès.`, 'success');
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
 * Traite une course individuelle : récupère partants (offline) et rapports (online)
 */
async function processCourse(date, reunionNum, courseInfo) {
    const cNum = courseInfo.numOrdre;
    
    // Construction des URLs
    const urlParticipants = `${API_OFFLINE}/${date}/R${reunionNum}/C${cNum}/participants`;
    const urlRapports = `${API_ONLINE}/${date}/R${reunionNum}/C${cNum}/rapports-definitifs`;

    // Appels parallèles pour cette course spécifique
    const [partantsData, rapportsData] = await Promise.all([
        fetchWithProxy(urlParticipants).catch(e => ({ participants: [] })),
        fetchWithProxy(urlRapports).catch(e => null)
    ]);

    return {
        id: `R${reunionNum}C${cNum}`,
        num_course: cNum,
        nom: courseInfo.libelle,
        heure_depart: courseInfo.heureDepart,
        discipline: courseInfo.discipline,
        ordre_arrivee: courseInfo.ordreArrivee || [],
        participants: partantsData.participants || [],
        rapports: rapportsData
    };
}

/**
 * Wrapper Fetch pour contourner le CORS
 */
async function fetchWithProxy(targetUrl) {
    const finalUrl = PROXY_URL + encodeURIComponent(targetUrl);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
        // Tentative de lecture de l'erreur
        const text = await response.text();
        throw new Error(`HTTP ${response.status} - ${text.substring(0, 50)}...`);
    }
    return await response.json();
}

/**
 * Génération et téléchargement du JSON
 */
function handleExport() {
    if (!globalExtractedData) return;

    const fileName = `PMU_${globalExtractedData.meta.date}_${globalExtractedData.meta.reunion}.json`;
    const dataStr = JSON.stringify(globalExtractedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- FONCTIONS UI ---

function renderResults(courses) {
    dom.results.innerHTML = '';
    
    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'race-card';
        
        const arriveeTxt = course.ordre_arrivee.length > 0 
            ? course.ordre_arrivee.join(' - ') 
            : 'Arrivée non disponible';

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
                <div><strong>Arrivée :</strong> ${arriveeTxt}</div>
            </div>
        `;
        dom.results.appendChild(div);
    });
}

function showStatus(msg, type) {
    dom.status.style.display = 'block';
    dom.status.className = `status-${type}`;
    dom.status.innerText = msg;
}

function setLoading(isLoading) {
    dom.btnFetch.disabled = isLoading;
    dom.date.disabled = isLoading;
    dom.reunion.disabled = isLoading;
    
    if (isLoading) {
        showStatus('Récupération des données en cours... (Cela peut prendre quelques secondes)', 'loading');
        dom.results.innerHTML = '';
        dom.btnExport.style.display = 'none';
    }
}
