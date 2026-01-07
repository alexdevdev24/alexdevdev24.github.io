/**
 * scriptpmu.js - Version STABLE (Pause & Resume)
 */

const PROXY_URL = 'https://corsproxy.io/?';
const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

// --- ÉTAT DU SCANNER (Pour permettre la reprise) ---
let state = {
    isRunning: false,
    dateList: [],
    currDateIdx: 0,
    currReunionIdx: 1, // On commence à R1
    results: [],
    threshold: 0,
    delay: 500
};

const dom = {}; // Stockage des éléments DOM

document.addEventListener('DOMContentLoaded', () => {
    // Init DOM
    dom.start = document.getElementById('dateStart');
    dom.end = document.getElementById('dateEnd');
    dom.minTrio = document.getElementById('minTrio');
    dom.delay = document.getElementById('apiDelay');
    dom.scanBtn = document.getElementById('scanBtn');
    dom.retryBtn = document.getElementById('retryBtn');
    dom.export = document.getElementById('exportBtn');
    dom.print = document.getElementById('printBtn');
    dom.status = document.getElementById('status');
    dom.container = document.getElementById('resultsContainer');
    dom.actions = document.getElementById('actionBar');

    if (!dom.scanBtn) return;

    // --- BOUTON NOUVEAU SCAN ---
    dom.scanBtn.addEventListener('click', () => {
        const dStart = dom.start.value.trim();
        const dEnd = dom.end.value.trim();
        
        if (!dStart || !dEnd) return alert('Dates requises (JJMMAAAA).');

        // Reset complet de l'état
        state.dateList = getDatesInRange(dStart, dEnd);
        state.currDateIdx = 0;
        state.currReunionIdx = 1;
        state.results = [];
        state.threshold = parseFloat(dom.minTrio.value) || 0;
        state.delay = parseInt(dom.delay.value) || 500;
        state.isRunning = true;

        dom.container.innerHTML = ''; // Clear écran
        dom.actions.style.display = 'none';
        dom.retryBtn.style.display = 'none';
        
        runScanner(); // Lancement
    });

    // --- BOUTON REPRENDRE ---
    dom.retryBtn.addEventListener('click', () => {
        state.isRunning = true;
        state.delay = parseInt(dom.delay.value) || 1000; // On peut ajuster le délai avant de reprendre
        dom.retryBtn.style.display = 'none';
        runScanner(); // Relance là où ça s'était arrêté
    });

    // --- EXPORTS ---
    dom.export.addEventListener('click', exportJSON);
    dom.print.addEventListener('click', () => window.print());
});

/**
 * Fonction Principale du Scanner (Boucle Séquentielle)
 */
async function runScanner() {
    setLoading(true);

    try {
        // Boucle sur les dates
        while (state.currDateIdx < state.dateList.length) {
            const date = state.dateList[state.currDateIdx];

            // Boucle sur les réunions (R1 à R6)
            while (state.currReunionIdx <= 6) {
                if (!state.isRunning) return; // Arrêt d'urgence si besoin

                const rNum = state.currReunionIdx;
                setStatus(`Analyse : ${date} - Réunion R${rNum} ... (${state.results.length} trouvés)`, 'status-loading');

                // 1. Pause de sécurité
                await sleep(state.delay);

                // 2. Traitement d'une réunion complète
                const coursesFound = await scanSingleMeeting(date, rNum, state.threshold);
                
                // 3. Ajout des résultats
                if (coursesFound && coursesFound.length > 0) {
                    state.results.push(...coursesFound);
                    renderCourses(coursesFound, state.threshold);
                }

                // Réunion suivante
                state.currReunionIdx++;
            }

            // Jour suivant : on reset les réunions à 1
            state.currDateIdx++;
            state.currReunionIdx = 1;
        }

        // --- FIN DU SCAN ---
        finishScan();

    } catch (e) {
        // --- ERREUR : ON MET EN PAUSE ---
        state.isRunning = false;
        console.error(e);
        setStatus(`ERREUR : ${e.message}. Vérifiez votre connexion.`, 'status-error');
        dom.retryBtn.style.display = 'inline-block'; // Afficher bouton reprise
        dom.scanBtn.disabled = false;
    }
}

/**
 * Scanne UNE réunion spécifique.
 * Retourne un tableau de courses ou lance une erreur critique.
 */
async function scanSingleMeeting(date, rNum, threshold) {
    try {
        // Appel Programme
        const progUrl = `${API_BASE}/${date}/R${rNum}`;
        const progData = await fetchAPI(progUrl, true); // true = ignorer 404

        if (!progData || !progData.courses) return []; // Pas de réunion R(x) ce jour là, on passe

        const found = [];

        // Boucle sur les courses de cette réunion
        for (const cInfo of progData.courses) {
            const cNum = cInfo.numOrdre;
            
            // Appel Rapports
            await sleep(state.delay / 2); // Petite pause interne
            const rapUrl = `${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`;
            const rapports = await fetchAPI(rapUrl, true);

            // Vérif Trio
            if (hasHighTrio(rapports, threshold)) {
                // Appel Participants (Seulement si Trio OK)
                await sleep(state.delay / 2);
                const partUrl = `${API_BASE}/${date}/R${rNum}/C${cNum}/participants`;
                const partData = await fetchAPI(partUrl, true);

                // Formatage
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
                    num: cNum,
                    nom: cInfo.libelle,
                    heure: cInfo.heureDepart,
                    discipline: cInfo.discipline,
                    arrivee: cInfo.ordreArrivee || [],
                    participants: parts,
                    rapports: rapports
                });
            }
        }
        return found;

    } catch (e) {
        // Si c'est une erreur réseau (pas une 404), on la remonte pour mettre en pause
        throw e;
    }
}

// --- LOGIQUE MÉTIER ---

function hasHighTrio(rapports, threshold) {
    if (!rapports || !Array.isArray(rapports)) return false;
    const targets = rapports.filter(r => r.typePari.includes('TRIO') || r.typePari.includes('TIERCE'));
    for (const t of targets) {
        for (const g of t.rapports) {
            let val = g.dividendePourUnEuro ? g.dividendePourUnEuro / 100 : (g.dividende / (t.miseBase || 100));
            if (val >= threshold) return true;
        }
    }
    return false;
}

function finishScan() {
    state.isRunning = false;
    dom.scanBtn.disabled = false;
    dom.retryBtn.style.display = 'none';
    
    if (state.results.length === 0) {
        setStatus("Scan terminé. Aucun résultat trouvé.", 'status-error');
    } else {
        setStatus(`Terminé ! ${state.results.length} courses trouvées.`, 'status-success');
        dom.actions.style.display = 'block';
        document.title = `PMU_SCAN_${state.dateList.length}J`;
    }
}

// --- UI & RENDU ---

function renderCourses(courses, threshold) {
    courses.forEach(c => {
        const div = document.createElement('div');
        div.className = 'race-card';
        const dateFmt = `${c.date.substring(0,2)}/${c.date.substring(2,4)}`;
        const htmlRapports = buildRapportsHTML(c.rapports, threshold);
        const htmlPartants = buildPartantsHTML(c.participants);

        div.innerHTML = `
            <div class="race-header">
                <span class="race-title">[${dateFmt}] ${c.id} - ${c.nom}</span>
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
            let style = (isTrio && val >= threshold) ? 'gain-high' : 'gain-cell';
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

async function fetchAPI(url, ignore404 = false) {
    const res = await fetch(PROXY_URL + encodeURIComponent(url));
    if (!res.ok) {
        if (ignore404 && res.status === 404) return null; // Normal pour une réunion qui n'existe pas
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
}

function getDatesInRange(start, end) {
    const parse = d => new Date(d.substring(4), d.substring(2,4)-1, d.substring(0,2));
    const fmt = d => String(d.getDate()).padStart(2,'0') + String(d.getMonth()+1).padStart(2,'0') + d.getFullYear();
    let curr = parse(start), last = parse(end), list = [];
    while (curr <= last) { list.push(fmt(curr)); curr.setDate(curr.getDate()+1); }
    return list;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function setLoading(isLoading) {
    dom.scanBtn.disabled = isLoading;
    if(isLoading) dom.retryBtn.style.display = 'none';
}

function setStatus(msg, type) {
    dom.status.style.display = 'block';
    dom.status.className = type;
    dom.status.innerText = msg;
}

function exportJSON() {
    if (!state.results.length) return;
    const blob = new Blob([JSON.stringify(state.results, null, 2)], {type: 'application/json;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PMU_SCAN_TRIO.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
