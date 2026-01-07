/**
 * scriptpmu.js - Version ULTRA ROBUSTE (Retry + Multi-Proxy)
 */

// LISTE DE PROXIES ROTATIFS (Priorité : Haut vers Bas)
const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://api.codetabs.com/v1/proxy?quest=',
    '' // Direct (si extension)
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
    const get = (id) => document.getElementById(id);
    dom.start = get('dateStart'); dom.end = get('dateEnd');
    dom.filterHippo = get('filterHippo'); dom.minTrio = get('minTrio');
    dom.delay = get('apiDelay'); dom.scanBtn = get('scanBtn');
    dom.retryBtn = get('retryBtn'); dom.export = get('exportBtn');
    dom.print = get('printBtn'); dom.status = get('status');
    dom.container = get('resultsContainer'); dom.actions = get('actionBar');
    dom.stEligibles = get('stEligibles'); dom.stFound = get('stFound');
    dom.stRatio = get('stRatio');

    if (!dom.scanBtn) return;

    dom.scanBtn.addEventListener('click', () => {
        const dStart = dom.start.value.trim();
        const dEnd = dom.end.value.trim();
        if (!dStart || !dEnd) return alert('Dates requises.');

        let keywords = [];
        if (dom.filterHippo && dom.filterHippo.value) {
            keywords = dom.filterHippo.value.toLowerCase().split(',').map(s=>s.trim()).filter(s=>s.length>0);
        }

        state.dateList = getDatesInRange(dStart, dEnd);
        if(state.dateList.length === 0) return alert("Dates invalides.");

        // Reset
        state.currDateIdx = 0; state.currReunionIdx = 1;
        state.results = []; state.stats = { eligibles: 0, found: 0 };
        state.threshold = parseFloat(dom.minTrio.value) || 0;
        state.delay = parseInt(dom.delay.value) || 500;
        state.hippoFilter = keywords;
        state.isRunning = true;

        dom.container.innerHTML = ''; dom.actions.style.display = 'none';
        dom.retryBtn.style.display = 'none';
        updateStatsUI();
        
        setStatus("Initialisation...", "status-loading");
        runScanner();
    });

    dom.retryBtn.addEventListener('click', () => {
        state.isRunning = true;
        state.delay += 200; // On augmente le délai pour être plus safe
        dom.retryBtn.style.display = 'none';
        runScanner();
    });

    dom.export.addEventListener('click', exportJSON);
    dom.print.addEventListener('click', () => window.print());
});

async function runScanner() {
    setLoading(true);
    try {
        while (state.currDateIdx < state.dateList.length) {
            const date = state.dateList[state.currDateIdx];
            while (state.currReunionIdx <= 6) { 
                if (!state.isRunning) return;
                const rNum = state.currReunionIdx;
                setStatus(`Scan : ${date} - R${rNum}`, 'status-loading');
                await sleep(state.delay); 

                const courses = await scanMeeting(date, rNum, state.threshold);
                if (courses.length > 0) {
                    state.results.push(...courses);
                    renderCourses(courses, state.threshold);
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
        setStatus(`ERREUR : ${e.message}`, 'status-error');
        dom.retryBtn.style.display = 'inline-block';
        dom.scanBtn.disabled = false;
    }
}

async function scanMeeting(date, rNum, threshold) {
    try {
        const progData = await fetchWithRetry(`${API_BASE}/${date}/R${rNum}`, true);
        if (!progData || !progData.courses) return [];

        const hippoObj = progData.hippodrome || {};
        const fullHippo = `${hippoObj.libelleLong||""} ${hippoObj.libelleCourt||""}`.toLowerCase();
        
        if (state.hippoFilter.length > 0) {
            if (!state.hippoFilter.some(k => fullHippo.includes(k))) return [];
        }

        const found = [];
        const hippoLabel = hippoObj.libelleCourt || "Inconnu";

        for (const cInfo of progData.courses) {
            if (cInfo.statut === "COURSE_ANNULEE") continue;

            const cNum = cInfo.numOrdre;
            await sleep(state.delay / 2);
            const rapports = await fetchWithRetry(`${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`, true);

            if (hasTrioBet(rapports)) {
                state.stats.eligibles++;
                updateStatsUI();

                if (hasHighTrio(rapports, threshold)) {
                    state.stats.found++;
                    updateStatsUI();
                    await sleep(state.delay / 2);
                    const partData = await fetchWithRetry(`${API_BASE}/${date}/R${rNum}/C${cNum}/participants`, true);
                    
                    const parts = (partData?.participants || []).map(p => ({
                        num: p.numPmu, nom: p.nomCheval || "?", driver: p.driver || "-", musique: p.musique || "-",
                        cote: p.dernierRapportDirect ? p.dernierRapportDirect.rapport : null
                    }));

                    found.push({
                        date: date, id: `R${rNum}C${cNum}`, hippo: hippoLabel, num: cNum,
                        nom: cInfo.libelle, heure: cInfo.heureDepart, arrivee: cInfo.ordreArrivee || [],
                        participants: parts, rapports: rapports
                    });
                }
            }
        }
        return found;
    } catch (e) { throw e; }
}

// --- SMART FETCH AVEC RETRY ---
async function fetchWithRetry(url, ignore404 = false, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await smartFetch(url, ignore404);
        } catch (e) {
            if (i === retries) throw e; // Si c'est le dernier essai, on plante
            await sleep(1000); // Attente 1s avant retry
        }
    }
}

async function smartFetch(url, ignore404) {
    let lastError = null;
    for (const proxy of PROXIES) {
        try {
            const finalUrl = proxy ? proxy + encodeURIComponent(url) : url;
            const res = await fetch(finalUrl);
            if (res.status === 404 && ignore404) return null;
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            // Vérification du contenu AVANT parsing
            const text = await res.text();
            if (!text || text.trim().length === 0) throw new Error("Réponse vide");
            
            try {
                return JSON.parse(text);
            } catch (jsonErr) {
                // Si ce n'est pas du JSON (ex: page HTML d'erreur proxy)
                throw new Error("Réponse invalide (pas du JSON)");
            }
        } catch (e) {
            lastError = e;
        }
    }
    throw new Error(`Echec total: ${lastError.message}`);
}

// --- METIER & UI (Inchangés) ---
function hasTrioBet(r) { return r && r.some(x => x.typePari.includes('TRIO') || x.typePari.includes('TIERCE')); }
function hasHighTrio(r, t) {
    if(!r) return false;
    const targets = r.filter(x => x.typePari.includes('TRIO') || x.typePari.includes('TIERCE'));
    for(const k of targets) {
        for(const g of k.rapports) {
            let v = g.dividendePourUnEuro ? g.dividendePourUnEuro/100 : (g.dividende/(k.miseBase||100));
            if(v >= t) return true;
        }
    }
    return false;
}
function updateStatsUI() {
    dom.stEligibles.innerText = state.stats.eligibles;
    dom.stFound.innerText = state.stats.found;
    dom.stRatio.innerText = state.stats.eligibles ? ((state.stats.found/state.stats.eligibles)*100).toFixed(2)+'%' : '0%';
}
function finishScan() {
    state.isRunning = false;
    dom.scanBtn.disabled = false; dom.retryBtn.style.display = 'none';
    setStatus(state.results.length ? "Terminé." : "Rien trouvé.", state.results.length ? 'status-success' : 'status-error');
    if(state.results.length) dom.actions.style.display = 'block';
}
function renderCourses(courses, thresh) {
    courses.forEach(c => {
        const div = document.createElement('div'); div.className = 'race-card';
        const dFmt = `${c.date.substring(0,2)}/${c.date.substring(2,4)}`;
        const hRap = buildRapportsHTML(c.rapports, thresh);
        const hPart = buildPartantsHTML(c.participants);
        div.innerHTML = `<div class="race-header"><span class="race-title">[${dFmt}] ${c.hippo} - ${c.id} - ${c.nom}</span><span>${new Date(c.heure).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div><div class="race-body"><div style="margin-bottom:10px;"><strong>Arrivée:</strong> ${c.arrivee.join('-')}</div><h4 style="color:#d63384">Rapports (> ${thresh}€)</h4>${hRap}<h4>Partants</h4><div style="overflow-x:auto">${hPart}</div></div>`;
        dom.container.appendChild(div);
    });
}
function buildRapportsHTML(r, t) {
    const keys = ['SIMPLE','COUPLE','TRIO','TIERCE','MULTI','QUARTE','QUINTE'];
    const hits = r.filter(x => keys.some(k => x.typePari.includes(k)));
    let h = `<table class="reports-table"><thead><tr><th>Pari</th><th>Comb.</th><th>Gain</th></tr></thead><tbody>`;
    hits.forEach(x => {
        let isTrio = x.typePari.includes('TRIO')||x.typePari.includes('TIERCE');
        let badge = isTrio ? 'badge badge-trio' : 'badge';
        x.rapports.forEach(g => {
            let v = g.dividendePourUnEuro ? g.dividendePourUnEuro/100 : (g.dividende/(x.miseBase||100));
            let s = (isTrio && v >= t) ? 'gain-high' : '';
            h += `<tr><td><span class="${badge}">${x.libelle||x.typePari.replace('E_','')}</span></td><td><b>${g.combinaison}</b></td><td class="${s}">${v.toFixed(2)} €</td></tr>`;
        });
    });
    return h+`</tbody></table>`;
}
function buildPartantsHTML(p) {
    if(!p.length) return '';
    let h = `<table class="participants-table"><thead><tr><th>N°</th><th>Cheval</th><th>Driver</th><th>Musique</th><th>Cote</th></tr></thead><tbody>`;
    p.forEach(x => h+=`<tr><td style="font-weight:bold;text-align:center">${x.num}</td><td>${x.nom}</td><td>${x.driver}</td><td style="font-size:0.8em">${x.musique}</td><td style="text-align:right">${x.cote||'-'}</td></tr>`);
    return h+`</tbody></table>`;
}
function getDatesInRange(start, end) {
    const parse = d => new Date(d.substring(4), d.substring(2,4)-1, d.substring(0,2));
    const fmt = d => String(d.getDate()).padStart(2,'0') + String(d.getMonth()+1).padStart(2,'0') + d.getFullYear();
    let curr = parse(start), last = parse(end), list = [];
    while (curr <= last) { list.push(fmt(curr)); curr.setDate(curr.getDate()+1); }
    return list;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function setLoading(l) { dom.scanBtn.disabled = l; if(l) dom.retryBtn.style.display = 'none'; }
function setStatus(m, t) { dom.status.style.display = 'block'; dom.status.className = t; dom.status.innerText = m; }
function exportJSON() {
    if (!state.results.length) return;
    const blob = new Blob([JSON.stringify(state.results, null, 2)], {type: 'application/json;charset=utf-8'});
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = `PMU_STATS_ROBUST.json`; document.body.appendChild(link); link.click();
}
