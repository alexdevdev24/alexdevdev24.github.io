/**
 * scriptpmu.js - Version ROBUSTE MULTI-PROXY
 * Tente plusieurs chemins pour contourner les blocages.
 */

// LISTE DES PROXIES (Ordre de priorité)
const PROXY_LIST = [
    'https://corsproxy.io/?',                   // Rapide, souvent bloqué
    'https://api.allorigins.win/raw?url=',      // Plus lent, mais souvent fiable
    'https://thingproxy.freeboard.io/fetch/',   // Secours
    ''                                          // Direct (si vous avez une extension CORS installée)
];

const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

// --- ÉTAT ---
let state = {
    isRunning: false,
    dateList: [],
    currDateIdx: 0,
    currReunionIdx: 1,
    results: [],
    threshold: 0,
    delay: 500,
    hippoFilter: [], 
    stats: { eligibles: 0, found: 0 }
};

const dom = {};

document.addEventListener('DOMContentLoaded', () => {
    // Init DOM avec sécurité
    const get = (id) => document.getElementById(id);
    
    dom.start = get('dateStart');
    dom.end = get('dateEnd');
    dom.filterHippo = get('filterHippo');
    dom.minTrio = get('minTrio');
    dom.delay = get('apiDelay');
    dom.scanBtn = get('scanBtn');
    dom.retryBtn = get('retryBtn');
    dom.export = get('exportBtn');
    dom.print = get('printBtn');
    dom.status = get('status');
    dom.container = get('resultsContainer');
    dom.actions = get('actionBar');
    dom.stEligibles = get('stEligibles');
    dom.stFound = get('stFound');
    dom.stRatio = get('stRatio');

    if (!dom.scanBtn) return;

    // --- CLICK SCANNER ---
    dom.scanBtn.addEventListener('click', () => {
        const dStart = dom.start.value.trim();
        const dEnd = dom.end.value.trim();
        
        if (!dStart || !dEnd) return alert('Dates requises (Format JJMMAAAA).');

        let keywords = [];
        if (dom.filterHippo && dom.filterHippo.value) {
            const rawFilter = dom.filterHippo.value.toLowerCase();
            keywords = rawFilter.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }

        // RESET
        state.dateList = getDatesInRange(dStart, dEnd);
        if(state.dateList.length === 0) return alert("Dates invalides.");

        state.currDateIdx = 0;
        state.currReunionIdx = 1;
        state.results = [];
        state.stats = { eligibles: 0, found: 0 };
        state.threshold = parseFloat(dom.minTrio.value) || 0;
        state.delay = parseInt(dom.delay.value) || 500;
        state.hippoFilter = keywords;
        state.isRunning = true;

        dom.container.innerHTML = '';
        dom.actions.style.display = 'none';
        dom.retryBtn.style.display = 'none';
        updateStatsUI();
        
        setStatus("Démarrage du scan multi-proxy...", "status-loading");
        runScanner();
    });

    dom.retryBtn.addEventListener('click', () => {
        state.isRunning = true;
        state.delay = parseInt(dom.delay.value) || 1000;
        dom.retryBtn.style.display = 'none';
        runScanner();
    });

    dom.export.addEventListener('click', exportJSON);
    dom.print.addEventListener('click', () => window.print());
});

/**
 * BOUCLE PRINCIPALE
 */
async function runScanner() {
    setLoading(true);

    try {
        while (state.currDateIdx < state.dateList.length) {
            const date = state.dateList[state.currDateIdx];

            while (state.currReunionIdx <= 6) { 
                if (!state.isRunning) return;

                const rNum = state.currReunionIdx;
                setStatus(`Analyse : ${date} - R${rNum}`, 'status-loading');

                await sleep(state.delay); 

                // Scan Meeting
                const coursesFound = await scanSingleMeeting(date, rNum, state.threshold);
                
                if (coursesFound && coursesFound.length > 0) {
                    state.results.push(...coursesFound);
                    renderCourses(coursesFound, state.threshold);
                }

                state.currReunionIdx++;
            }
            state.currDateIdx++;
            state.currReunionIdx = 1;
        }
        finishScan();

    } catch (e) {
        state.isRunning = false;
        console.error(e);
        setStatus(`ERREUR : ${e.message}. Essayez d'augmenter la pause.`, 'status-error');
        dom.retryBtn.style.display = 'inline-block';
        dom.scanBtn.disabled = false;
    }
}

/**
 * SCAN REUNION
 */
async function scanSingleMeeting(date, rNum, threshold) {
    try {
        const progUrl = `${API_BASE}/${date}/R${rNum}`;
        // On utilise la fonction smartFetch qui essaie plusieurs proxies
        const progData = await smartFetch(progUrl, true);

        if (!progData || !progData.courses) return [];

        // Filtre Hippodrome
        const hippoObj = progData.hippodrome || {};
        const fullHippoName = `${hippoObj.libelleLong || ""} ${hippoObj.libelleCourt || ""}`.toLowerCase();
        
        if (state.hippoFilter.length > 0) {
            const isMatch = state.hippoFilter.some(keyword => fullHippoName.includes(keyword));
            if (!isMatch) return []; 
        }

        const found = [];
        const hippoLabel = hippoObj.libelleCourt || hippoObj.libelleLong || "Inconnu";

        for (const cInfo of progData.courses) {
            if (cInfo.statut === "COURSE_ANNULEE") continue;

            const cNum = cInfo.numOrdre;
            
            // Rapports
            await sleep(state.delay / 3);
            const rapUrl = `${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`;
            const rapports = await smartFetch(rapUrl, true);

            if (hasTrioBet(rapports)) {
                state.stats.eligibles++;
                updateStatsUI();

                if (hasHighTrio(rapports, threshold)) {
                    state.stats.found++;
                    updateStatsUI();

                    // Participants
                    await sleep(state.delay / 2);
                    const partUrl = `${API_BASE}/${date}/R${rNum}/C${cNum}/participants`;
                    const partData = await smartFetch(partUrl, true);

                    const parts = (partData?.participants || []).map(p => ({
                        num: p.numPmu,
                        nom: p.nomCheval || p.nom || "?",
                        driver: p.driver || p.jockey || "-",
                        musique: p.musique || "-",
                        cote: p.dernierRapportDirect ? p.dernierRapportDirect.rapport : null
                    }));

                    found.push({
                        date: date,
                        id: `R${rNum}C${cNum}`,
                        hippo: hippoLabel,
                        num: cNum,
                        nom: cInfo.libelle,
                        heure: cInfo.heureDepart,
                        arrivee: cInfo.ordreArrivee || [],
                        participants: parts,
                        rapports: rapports
                    });
                }
            }
        }
        return found;

    } catch (e) { throw e; }
}

// --- SMART FETCH (ROTATION DE PROXIES) ---
// Cette fonction est le coeur de la réparation
async function smartFetch(url, ignore404 = false) {
    let lastError = null;

    for (const proxyBase of PROXY_LIST) {
        try {
            const finalUrl = proxyBase + encodeURIComponent(url);
            
            // Si le proxy est vide (mode direct), on n'encode pas
            const fetchUrl = proxyBase === '' ? url : finalUrl;

            const res = await fetch(fetchUrl);
            
            if (res.status === 404 && ignore404) return null; // 404 est une réponse valide (pas de course)
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            // Tentative de parsing JSON
            const data = await res.json();
            
            // Si on est là, c'est que ça a marché !
            return data;

        } catch (e) {
            // Si ça échoue, on continue à la prochaine boucle (prochain proxy)
            // console.warn(`Echec proxy ${proxyBase} :`, e);
            lastError = e;
        }
    }

    // Si tous les proxys ont échoué
    throw new Error(`Echec total (tous proxies bloqués). Dernier: ${lastError.message}`);
}

// --- LOGIQUE METIER (Inchangée) ---

function hasTrioBet(rapports) {
    if (!rapports || !Array.isArray(rapports)) return false;
    return rapports.some(r => r.typePari.includes('TRIO') || r.typePari.includes('TIERCE'));
}

function hasHighTrio(rapports, threshold) {
    if (!rapports) return false;
    const targets = rapports.filter(r => r.typePari.includes('TRIO') || r.typePari.includes('TIERCE'));
    for (const t of targets) {
        for (const g of t.rapports) {
            let val = g.dividendePourUnEuro ? g.dividendePourUnEuro/100 : (g.dividende/(t.miseBase||100));
            if (val >= threshold) return true;
        }
    }
    return false;
}

function updateStatsUI() {
    dom.stEligibles.innerText = state.stats.eligibles;
    dom.stFound.innerText = state.stats.found;
    let ratio = state.stats.eligibles > 0 ? (state.stats.found / state.stats.eligibles) * 100 : 0;
    dom.stRatio.innerText = ratio.toFixed(2) + '%';
}

function finishScan() {
    state.isRunning = false;
    dom.scanBtn.disabled = false;
    dom.retryBtn.style.display = 'none';
    const msg = state.results.length ? "Scan terminé." : "Aucun résultat trouvé.";
    const type = state.results.length ? 'status-success' : 'status-error';
    setStatus(msg, type);
    if (state.results.length) dom.actions.style.display = 'block';
}

function renderCourses(courses, threshold) {
    courses.forEach(c => {
        const div = document.createElement('div');
        div.className = 'race-card';
        const dateFmt = `${c.date.substring(0,2)}/${c.date.substring(2,4)}`;
        const htmlRapports = buildRapportsHTML(c.rapports, threshold);
        const htmlPartants = buildPartantsHTML(c.participants);

        div.innerHTML = `
            <div class="race-header">
                <span class="race-title">[${dateFmt}] ${c.hippo} - ${c.id} - ${c.nom}</span>
                <span>${new Date(c.heure).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
            <div class="race-body">
                <div style="margin-bottom:10px;"><strong>Arrivée:</strong> ${c.arrivee.join('-')}</div>
                <h4 style="color:#d63384">Rapports (> ${threshold}€)</h4>
                ${htmlRapports}
                <h4>Partants</h4>
                <div style="overflow-x:auto">${htmlPartants}</div>
            </div>
        `;
        dom.container.appendChild(div);
    });
}

function buildRapportsHTML(rapports, threshold) {
    const keys = ['SIMPLE','COUPLE','TRIO','TIERCE','MULTI','QUARTE','QUINTE'];
    const hits = rapports.filter(r => keys.some(k => r.typePari.includes(k)));
    let html = `<table class="reports-table"><thead><tr><th>Pari</th><th>Comb.</th><th>Gain</th></tr></thead><tbody>`;
    hits.forEach(r => {
        let isTrio = r.typePari.includes('TRIO') || r.typePari.includes('TIERCE');
        let badge = isTrio ? 'badge badge-trio' : 'badge';
        let lbl = r.libelle || r.typePari.replace('E_','');
        r.rapports.forEach(g => {
            let val = g.dividendePourUnEuro ? g.dividendePourUnEuro/100 : (g.dividende/(r.miseBase||100));
            let style = (isTrio && val >= threshold) ? 'gain-high' : '';
            html += `<tr><td><span class="${badge}">${lbl}</span></td><td><b>${g.combinaison}</b></td><td class="${style}">${val.toFixed(2)} €</td></tr>`;
        });
    });
    return html + `</tbody></table>`;
}

function buildPartantsHTML(parts) {
    if(!parts.length) return '';
    let html = `<table class="participants-table"><thead><tr><th style="width:30px">N°</th><th>Cheval</th><th>Driver</th><th>Musique</th><th style="width:60px">Cote</th></tr></thead><tbody>`;
    parts.forEach(p => {
        html += `<tr><td style="font-weight:bold;text-align:center">${p.num}</td><td>${p.nom}</td><td>${p.driver}</td><td style="font-size:0.8em;color:#555">${p.musique}</td><td style="text-align:right">${p.cote||'-'}</td></tr>`;
    });
    return html + `</tbody></table>`;
}

// --- UTILS ---
function getDatesInRange(start, end) {
    const parse = d => new Date(d.substring(4), d.substring(2,4)-1, d.substring(0,2));
    const fmt = d => String(d.getDate()).padStart(2,'0') + String(d.getMonth()+1).padStart(2,'0') + d.getFullYear();
    let curr = parse(start), last = parse(end), list = [];
    while (curr <= last) { list.push(fmt(curr)); curr.setDate(curr.getDate()+1); }
    return list;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function setLoading(isLoading) { dom.scanBtn.disabled = isLoading; if(isLoading) dom.retryBtn.style.display = 'none'; }
function setStatus(msg, type) { dom.status.style.display = 'block'; dom.status.className = type; dom.status.innerText = msg; }
function exportJSON() {
    if (!state.results.length) return;
    const blob = new Blob([JSON.stringify(state.results, null, 2)], {type: 'application/json;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PMU_STATS_FILTER.json`;
    document.body.appendChild(link);
    link.click();
}
