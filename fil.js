/**
 * scriptpmu.js - Version SCANNER RANGE
 * Fonctionnalité : Scanne une plage de dates, check toutes les réunions, filtre par gain Trio.
 */

const PROXY_URL = 'https://corsproxy.io/?';
const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

let globalScanResults = [];

document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        start: document.getElementById('dateStart'),
        end: document.getElementById('dateEnd'),
        threshold: document.getElementById('minTrio'),
        scanBtn: document.getElementById('scanBtn'),
        export: document.getElementById('exportBtn'),
        print: document.getElementById('printBtn'),
        actionBar: document.getElementById('actionBar'),
        status: document.getElementById('status'),
        container: document.getElementById('resultsContainer')
    };

    if (!dom.scanBtn) return;

    dom.scanBtn.addEventListener('click', async () => {
        const dStart = dom.start.value.trim();
        const dEnd = dom.end.value.trim();
        const minVal = parseFloat(dom.threshold.value) || 0;

        if (!dStart || !dEnd) return alert('Veuillez remplir les dates de début et de fin (JJMMAAAA).');

        setLoading(dom, true, "Préparation du scan...");
        dom.container.innerHTML = '';
        dom.actionBar.style.display = 'none';
        globalScanResults = [];

        try {
            const dates = getDatesInRange(dStart, dEnd);
            let totalFound = 0;

            // Boucle jour par jour
            for (const date of dates) {
                setStatus(dom, `Analyse du ${date}... (${totalFound} trouvés)`, 'status-loading');
                
                // 1. Récupérer toutes les réunions du jour (R1, R2, etc.)
                // L'API programme/DDMMYYYY donne la liste des réunions
                const dailyProg = await fetchAPI(`${API_BASE}/${date}`);
                
                // Si l'API structure change, on adapte. Généralement programme/{date} renvoie liste réunions
                // Note: L'endpoint programme/{date} renvoie un objet avec "reunions": [...]
                // Mais l'endpoint programme/{date}/R{x} est celui qu'on utilisait.
                // Astuce : On va tenter de brute-forcer R1 à R6 pour être sûr, ou lire le endpoint daily si dispo.
                // Pour simplifier et être robuste : on teste R1 à R5 (les plus courantes).
                
                const reunionsToCheck = [1, 2, 3, 4, 5, 6]; 
                
                // On traite les réunions en parallèle pour ce jour-là
                const promises = reunionsToCheck.map(rNum => scanMeeting(date, rNum, minVal));
                const resultsDay = await Promise.all(promises);

                // Aplatir les résultats et ajouter au global
                const validCourses = resultsDay.flat().filter(c => c !== null);
                
                if (validCourses.length > 0) {
                    totalFound += validCourses.length;
                    globalScanResults.push(...validCourses);
                    // Affichage au fil de l'eau
                    renderUI(dom, validCourses, minVal); 
                }
            }

            if (globalScanResults.length === 0) {
                setStatus(dom, "Aucune course trouvée avec ce montant de Trio sur la période.", 'status-error');
            } else {
                setStatus(dom, `Terminé ! ${globalScanResults.length} courses trouvées rapportant plus de ${minVal}€ au Trio.`, 'status-success');
                dom.actionBar.style.display = 'block';
                document.title = `SCAN_TRIO_${dStart}_${dEnd}`;
            }

        } catch (e) {
            console.error(e);
            setStatus(dom, "Erreur critique : " + e.message, 'status-error');
        } finally {
            dom.scanBtn.disabled = false;
        }
    });

    // EXPORT & PRINT
    dom.export.addEventListener('click', () => {
        if (!globalScanResults.length) return;
        const blob = new Blob([JSON.stringify(globalScanResults, null, 2)], {type: 'application/json;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `PMU_TRIO_SCAN.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    dom.print.addEventListener('click', () => window.print());
});

/**
 * Scanne une réunion entière :
 * 1. Récupère la liste des courses
 * 2. Vérifie les rapports Trio
 * 3. Si OK, charge les Participants
 */
async function scanMeeting(date, rNum, threshold) {
    try {
        // Récup programme réunion
        const progUrl = `${API_BASE}/${date}/R${rNum}`;
        const progData = await fetchAPI(progUrl); // Peut renvoyer 404 si R n'existe pas

        if (!progData || !progData.courses) return [];

        const foundCourses = [];

        // Itération sur les courses de la réunion
        for (const cInfo of progData.courses) {
            const cNum = cInfo.numOrdre;
            
            // A. Récupération des Rapports UNIQUEMENT d'abord (léger)
            const urlRap = `${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`;
            const rapports = await fetchAPI(urlRap).catch(() => null);

            // B. Vérification du filtre Trio
            if (hasHighTrio(rapports, threshold)) {
                
                // C. Bingo ! On charge les détails lourds (Participants)
                const urlPart = `${API_BASE}/${date}/R${rNum}/C${cNum}/participants`;
                const partData = await fetchAPI(urlPart).catch(() => ({ participants: [] }));

                // Formatage
                const parts = (partData.participants || []).map(p => ({
                    num: p.numPmu,
                    nom: p.nomCheval || p.nom || "?",
                    driver: p.driver || p.jockey || "-",
                    musique: p.musique || "-",
                    cote: p.dernierRapportDirect ? p.dernierRapportDirect.rapport : null
                }));

                const conditions = Array.isArray(cInfo.conditions) ? cInfo.conditions.join(". ") : (cInfo.conditions || "");

                foundCourses.push({
                    date: date,
                    id: `R${rNum}C${cNum}`,
                    num: cNum,
                    nom: cInfo.libelle,
                    heure: cInfo.heureDepart,
                    discipline: cInfo.discipline,
                    arrivee: cInfo.ordreArrivee || [],
                    participants: parts,
                    rapports: rapports, // On garde tout pour affichage
                    conditions: conditions
                });
            }
        }
        return foundCourses;

    } catch (e) {
        // Erreur silencieuse (ex: R5 n'existe pas ce jour là)
        return [];
    }
}

/**
 * Vérifie si un rapport Trio dépasse le seuil
 */
function hasHighTrio(rapports, threshold) {
    if (!rapports || !Array.isArray(rapports)) return false;
    
    // On cherche les paris TRIO ou TRIO_ORDRE
    const trios = rapports.filter(r => r.typePari.includes('TRIO') || r.typePari.includes('TIERCE'));
    
    for (const t of trios) {
        for (const g of t.rapports) {
            // Calcul gain pour 1€
            let val = g.dividendePourUnEuro ? g.dividendePourUnEuro / 100 : (g.dividende / (t.miseBase || 100));
            if (val >= threshold) return true;
        }
    }
    return false;
}

// --- RENDU INCREMENTAL ---

function renderUI(dom, courses, threshold) {
    courses.forEach(c => {
        const div = document.createElement('div');
        div.className = 'race-card high-trio'; // Classe CSS pour mise en valeur

        const dateFmt = `${c.date.substring(0,2)}/${c.date.substring(2,4)}/${c.date.substring(4)}`;
        const heure = new Date(c.heure).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        
        const htmlRapports = buildRapportsTable(c.rapports, threshold);
        const htmlPartants = buildPartantsTable(c.participants);

        div.innerHTML = `
            <div class="race-header">
                <span class="race-title">[${dateFmt}] ${c.id} - ${c.nom}</span>
                <span>${heure}</span>
            </div>
            <div class="race-body">
                <div class="meta-box">
                    <strong>Discipline :</strong> ${c.discipline} | 
                    <strong>Arrivée :</strong> ${c.arrivee.join('-')}
                </div>

                <h4 style="color:#d63384">Rapports Trio & autres (Seuil > ${threshold}€)</h4>
                ${htmlRapports}

                <h4>Tableau des Partants</h4>
                <div style="overflow-x:auto">${htmlPartants}</div>
            </div>
        `;
        dom.container.appendChild(div);
    });
}

function buildRapportsTable(rapports, threshold) {
    // On affiche TOUT ou juste les Trios ? Affichons Trio/Couplé/Simple pour contexte, mais highlight Trio
    const keys = ['SIMPLE', 'COUPLE', 'TRIO', 'TIERCE', 'MULTI', 'QUARTE', 'QUINTE'];
    const hits = rapports.filter(r => keys.some(k => r.typePari.includes(k)));

    let html = `<table class="reports-table"><thead><tr><th>Pari</th><th>Combinaison</th><th>Gain (1€)</th></tr></thead><tbody>`;

    hits.forEach(r => {
        let isTrio = r.typePari.includes('TRIO') || r.typePari.includes('TIERCE');
        let lbl = r.libelle || r.typePari.replace('E_','');
        let badge = 'badge';
        if(isTrio) badge = 'badge badge-trio';

        r.rapports.forEach(g => {
            let val = g.dividendePourUnEuro ? g.dividendePourUnEuro / 100 : (g.dividende / (r.miseBase || 100));
            
            // Highlight si c'est le Trio gagnant > seuil
            let cellClass = 'gain-cell';
            if (isTrio && val >= threshold) cellClass += ' gain-high';

            html += `<tr>
                <td><span class="${badge}">${lbl}</span></td>
                <td><b>${g.combinaison}</b></td>
                <td class="${cellClass}">${val.toFixed(2)} €</td>
            </tr>`;
        });
    });
    html += `</tbody></table>`;
    return html;
}

function buildPartantsTable(participants) {
    if (!participants.length) return '';
    let html = `<table class="participants-table"><thead><tr><th style="width:40px;">N°</th><th>Cheval</th><th>Driver</th><th>Musique</th><th style="width:60px;text-align:right;">Cote</th></tr></thead><tbody>`;
    participants.forEach(p => {
        html += `<tr>
            <td style="text-align:center;font-weight:bold;">${p.num}</td>
            <td>${p.nom}</td>
            <td>${p.driver}</td>
            <td style="font-size:0.8em;color:#555;">${p.musique}</td>
            <td style="text-align:right;">${p.cote || '-'}</td>
        </tr>`;
    });
    return html + `</tbody></table>`;
}

// --- UTILS DATES ---
function getDatesInRange(startStr, endStr) {
    // Format entrée JJMMAAAA
    // Conversion en Date Object
    function toDate(d) {
        const day = parseInt(d.substring(0,2));
        const month = parseInt(d.substring(2,4)) - 1;
        const year = parseInt(d.substring(4));
        return new Date(year, month, day);
    }
    
    // Format sortie JJMMAAAA
    function fromDate(d) {
        let dd = String(d.getDate()).padStart(2, '0');
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let yyyy = d.getFullYear();
        return `${dd}${mm}${yyyy}`;
    }

    let current = toDate(startStr);
    const end = toDate(endStr);
    const list = [];

    while (current <= end) {
        list.push(fromDate(current));
        current.setDate(current.getDate() + 1);
    }
    return list;
}

// --- UTILS API ---
async function fetchAPI(url) {
    const res = await fetch(PROXY_URL + encodeURIComponent(url));
    if (!res.ok) throw new Error(res.status);
    return await res.json();
}
function setStatus(dom, msg, type) {
    dom.status.style.display = 'block';
    dom.status.className = type;
    dom.status.innerText = msg;
}
function setLoading(dom, loading, msg="") {
    dom.scanBtn.disabled = loading;
    if(loading) setStatus(dom, msg, 'status-loading');
}
