/**
 * scriptpmu.js - VERSION RÉPARATION (Fail-Safe Cache)
 * Si le cache plante, le script continue quand même.
 */

const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://api.codetabs.com/v1/proxy?quest=',
    '' // Direct (en dernier recours)
];

const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

// --- GESTIONNAIRE DE CACHE SÉCURISÉ ---
const DB = {
    dbName: 'PMU_Cache_DB',
    storeName: 'api_responses',
    db: null,
    enabled: true, // Se désactive si erreur

    async init() {
        if (!window.indexedDB) {
            console.warn("IndexedDB non supporté. Cache désactivé.");
            this.enabled = false;
            return;
        }
        return new Promise((resolve) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                console.log("DB Cache: Connecté.");
                resolve();
            };
            request.onerror = (e) => {
                console.error("DB Cache: Erreur ouverture.", e);
                this.enabled = false; // On désactive le cache pour ne pas bloquer le script
                resolve(); // On résout quand même pour continuer
            };
        });
    },

    async get(key) {
        if (!this.enabled || !this.db) return null;
        return new Promise((resolve) => {
            try {
                const tx = this.db.transaction(this.storeName, 'readonly');
                const store = tx.objectStore(this.storeName);
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(null);
            } catch (e) {
                console.warn("DB Read Error", e);
                resolve(null);
            }
        });
    },

    async set(key, value) {
        if (!this.enabled || !this.db) return;
        try {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            tx.objectStore(this.storeName).put(value, key);
        } catch (e) { console.warn("DB Write Error", e); }
    },

    async clear() {
        if (!this.enabled || !this.db) return;
        const tx = this.db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).clear();
        return new Promise(r => tx.oncomplete = r);
    },
    
    async count() {
        if (!this.enabled || !this.db) return 0;
        return new Promise(r => {
            const req = this.db.transaction(this.storeName, 'readonly').objectStore(this.storeName).count();
            req.onsuccess = () => r(req.result);
            req.onerror = () => r(0);
        });
    }
};

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

document.addEventListener('DOMContentLoaded', async () => {
    // Init DOM
    const get = (id) => document.getElementById(id);
    dom.start = get('dateStart'); dom.end = get('dateEnd');
    dom.filterHippo = get('filterHippo'); dom.minTrio = get('minTrio');
    dom.delay = get('apiDelay'); dom.scanBtn = get('scanBtn');
    dom.retryBtn = get('retryBtn'); dom.export = get('exportBtn');
    dom.print = get('printBtn'); dom.status = get('status');
    dom.container = get('resultsContainer'); dom.actions = get('actionBar');
    dom.stEligibles = get('stEligibles'); dom.stFound = get('stFound');
    dom.stRatio = get('stRatio');
    dom.cacheBtn = get('cacheBtn'); dom.cacheStats = get('cacheStats');

    // Init Cache (ne bloque pas si erreur)
    await DB.init();
    if(dom.cacheStats) updateCacheStats();

    if (!dom.scanBtn) return;

    // --- CLICK SCAN ---
    dom.scanBtn.addEventListener('click', () => {
        console.log("Bouton Scan cliqué.");
        const dStart = dom.start.value.trim();
        const dEnd = dom.end.value.trim();
        
        if (!dStart || !dEnd) return alert('Veuillez entrer les dates.');

        let keywords = [];
        if (dom.filterHippo && dom.filterHippo.value) {
            keywords = dom.filterHippo.value.toLowerCase().split(',').map(s=>s.trim()).filter(s=>s.length>0);
        }

        try {
            state.dateList = getDatesInRange(dStart, dEnd);
        } catch(e) { return alert("Dates invalides."); }

        if(state.dateList.length === 0) return alert("Dates incohérentes.");

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
        
        setStatus("Initialisation du scan...", "status-loading");
        runScanner();
    });

    // --- AUTRES EVENTS ---
    dom.retryBtn.addEventListener('click', () => {
        state.isRunning = true;
        state.currReunionIdx++; // On saute l'obstacle
        dom.retryBtn.style.display = 'none';
        runScanner();
    });

    if(dom.cacheBtn) {
        dom.cacheBtn.addEventListener('click', async () => {
            await DB.clear();
            updateCacheStats();
            alert("Cache vidé !");
        });
    }

    dom.export.addEventListener('click', exportJSON);
    dom.print.addEventListener('click', () => window.print());
});

async function updateCacheStats() {
    if(!dom.cacheStats) return;
    const count = await DB.count();
    const status = DB.enabled ? "Actif" : "Désactivé (Erreur)";
    dom.cacheStats.innerText = `Cache: ${status} | ${count} fichiers`;
}

// --- SCANNER PRINCIPAL ---
async function runScanner() {
    setLoading(true);
    try {
        while (state.currDateIdx < state.dateList.length) {
            const date = state.dateList[state.currDateIdx];

            while (state.currReunionIdx <= 6) { 
                if (!state.isRunning) return;
                const rNum = state.currReunionIdx;
                setStatus(`Scan: ${date} - R${rNum}`, 'status-loading');

                // Petite pause UI
                await sleep(50); 

                try {
                    const courses = await scanSingleMeeting(date, rNum, state.threshold);
                    if (courses.length > 0) {
                        state.results.push(...courses);
                        renderCourses(courses, state.threshold);
                    }
                } catch (e) {
                    console.warn(`Skip ${date} R${rNum} (Erreur ou Vide)`);
                }
                
                state.currReunionIdx++;
            }
            state.currDateIdx++;
            state.currReunionIdx = 1;
            updateCacheStats();
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

async function scanSingleMeeting(date, rNum, threshold) {
    const progData = await fetchCached(`${API_BASE}/${date}/R${rNum}`);
    if (!progData || !progData.courses) return [];

    const hippoObj = progData.hippodrome || {};
    const fullHippo = `${hippoObj.libelleLong||""} ${hippoObj.libelleCourt||""}`.toLowerCase();
    
    // Filtre Hippo
    if (state.hippoFilter.length > 0) {
        if (!state.hippoFilter.some(k => fullHippo.includes(k))) return [];
    }

    const found = [];
    const hippoLabel = hippoObj.libelleCourt || "Inconnu";

    for (const cInfo of progData.courses) {
        if (cInfo.statut === "COURSE_ANNULEE") continue;

        const cNum = cInfo.numOrdre;
        const rapports = await fetchCached(`${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`);

        if (hasTrioBet(rapports)) {
            state.stats.eligibles++;
            updateStatsUI();

            if (hasHighTrio(rapports, threshold)) {
                state.stats.found++;
                updateStatsUI();

                const partData = await fetchCached(`${API_BASE}/${date}/R${rNum}/C${cNum}/participants`);
                
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
}

// --- FETCHING (Cache -> Network -> Proxy Rotation) ---

async function fetchCached(url) {
    // 1. Essai Cache
    if (DB.enabled) {
        const cached = await DB.get(url);
        if (cached) return cached;
    }

    // 2. Pause API (Rate Limit) uniquement si pas en cache
    await sleep(state.delay);

    // 3. Réseau
    const data = await fetchWithRetry(url, true);

    // 4. Sauvegarde
    if (data && DB.enabled) {
        await DB.set(url, data);
    }
    return data;
}

async function fetchWithRetry(url, ignore404, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await smartFetch(url, ignore404);
        } catch (e) {
            if (i === retries) return null; // Abandon
            await sleep(1000);
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
            
            const text = await res.text();
            if (!text || text.trim().length === 0) throw new Error("Empty");
            
            try { return JSON.parse(text); } catch (e) { throw new Error("Not JSON"); }

        } catch (e) {
            lastError = e;
            // Continue next proxy
        }
    }
    throw lastError || new Error("Network Error");
}

// --- LOGIQUE METIER (Inchangée) ---
function hasTrioBet(r) { return r && Array.isArray(r) && r.some(x => x.typePari.includes('TRIO') || x.typePari.includes('TIERCE')); }
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
    setStatus(state.results.length ? "Terminé." : "Aucun résultat.", state.results.length ? 'status-success' : 'status-error');
    if(state.results.length) dom.actions.style.display = 'block';
    updateCacheStats();
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
    if(!r) return '';
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
    if(!p || !p.length) return '';
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
    link.download = `PMU_CACHE_SCAN.json`; document.body.appendChild(link); link.click();
}
