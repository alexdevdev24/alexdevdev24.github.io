/**
 * scriptpmu.js - Version Production
 * Gestion: Rapports (Centimes->Euros), Terrain, Conditions, Participants
 */

const PROXY_URL = 'https://corsproxy.io/?';
const API_BASE = 'https://online.turfinfo.api.pmu.fr/rest/client/1/programme';

let globalData = null;

document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        date: document.getElementById('dateInput'),
        reunion: document.getElementById('reunionInput'),
        fetch: document.getElementById('fetchBtn'),
        export: document.getElementById('exportBtn'),
        status: document.getElementById('status'),
        container: document.getElementById('resultsContainer')
    };

    if (!dom.fetch) return;

    // --- CHARGEMENT ---
    dom.fetch.addEventListener('click', async () => {
        const date = dom.date.value.trim();
        const rStr = dom.reunion.value.trim().toUpperCase();
        const rNum = rStr.replace(/\D/g, '');

        if (!date || !rNum) return alert('Date et Réunion requises');

        setLoading(dom, true);
        dom.container.innerHTML = '';
        
        globalData = { meta: { date, reunion: rStr }, courses: [] };

        try {
            // 1. Récupération Programme (Contient Terrain & Conditions)
            const progUrl = `${API_BASE}/${date}/R${rNum}`;
            const progData = await fetchAPI(progUrl);

            if (!progData.courses) throw new Error("Réunion introuvable ou vide.");

            // 2. Traitement Parallèle
            const tasks = progData.courses.map(c => processCourse(date, rNum, c));
            globalData.courses = await Promise.all(tasks);
            globalData.courses.sort((a, b) => a.num - b.num);

            // 3. Affichage
            renderUI(dom, globalData.courses);
            dom.export.style.display = 'block';
            setStatus(dom, `${globalData.courses.length} courses chargées.`, 'status-loading', false); // Clean status

        } catch (e) {
            console.error(e);
            setStatus(dom, "Erreur: " + e.message, 'status-error');
        } finally {
            setLoading(dom, false);
        }
    });

    // --- EXPORT ---
    dom.export.addEventListener('click', () => {
        if (!globalData) return;
        const blob = new Blob([JSON.stringify(globalData, null, 2)], {type: 'application/json;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `PMU_${globalData.meta.date}_${globalData.meta.reunion}.json`;
        link.click();
    });
});

// --- LOGIQUE MÉTIER ---

async function processCourse(date, rNum, cInfo) {
    const cNum = cInfo.numOrdre;
    
    // Appels Parallèles (Participants + Rapports)
    const [partants, rapports] = await Promise.all([
        fetchAPI(`${API_BASE}/${date}/R${rNum}/C${cNum}/participants`).catch(() => ({ participants: [] })),
        fetchAPI(`${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`).catch(() => null)
    ]);

    // Formatage Participants
    const parts = (partants.participants || []).map(p => ({
        num: p.numPmu,
        nom: p.nomCheval,
        driver: p.driver || p.jockey,
        entraineur: p.entraineur,
        musique: p.musique,
        cote: p.dernierRapportDirect ? p.dernierRapportDirect.rapport : null
    }));

    // Extraction Conditions & Terrain (Depuis l'objet cInfo du programme initial)
    const terrain = {
        nature: cInfo.etatTerrain || "Non renseigné", // ex: BON SOUPLE
        penetrometre: cInfo.valeurPenetrometre || "-"
    };

    // Les conditions sont souvent un tableau de strings dans l'objet API
    const conditionsTxt = Array.isArray(cInfo.conditions) ? cInfo.conditions.join(". ") : (cInfo.conditions || "");

    return {
        id: `R${rNum}C${cNum}`,
        num: cNum,
        nom: cInfo.libelle,
        discipline: cInfo.discipline,
        heure: cInfo.heureDepart,
        arrivee: cInfo.ordreArrivee || [],
        terrain: terrain,
        conditions: conditionsTxt, // ex: "Pour poulains entiers... Handicap Classe 2"
        specialite: cInfo.specialite || cInfo.discipline,
        participants: parts,
        rapports: rapports // Objet brut pour l'export, traité pour l'affichage
    };
}

// --- AFFICHAGE HTML ---

function renderUI(dom, courses) {
    courses.forEach(c => {
        const div = document.createElement('div');
        div.className = 'race-card';

        // Logique Rapports
        const rapportsHTML = buildRapportsTable(c.rapports);
        
        // Logique Arrivée
        const arrTxt = c.arrivee.length ? c.arrivee.join(' - ') : 'En cours...';

        div.innerHTML = `
            <div class="race-header">
                <span>C${c.num} - ${c.nom}</span>
                <span>${new Date(c.heure).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            </div>
            <div class="race-body">
                
                <div class="meta-grid">
                    <div class="meta-item">
                        <strong>Discipline:</strong> ${c.discipline}<br>
                        <strong>Terrain:</strong> ${c.terrain.nature} (${c.terrain.penetrometre})
                    </div>
                    <div class="meta-item">
                        <strong>Arrivée:</strong> <span style="color:#d63384;font-weight:bold">${arrTxt}</span><br>
                        <strong>Partants:</strong> ${c.participants.length}
                    </div>
                </div>
                <div style="margin-bottom:10px; font-style:italic; font-size:0.9em; color:#666;">
                    ${c.conditions}
                </div>

                ${rapportsHTML}

                <details>
                    <summary>Voir les participants (Musique, Cotes)</summary>
                    <div style="max-height:200px; overflow-y:auto; margin-top:5px;">
                        <table style="width:100%; font-size:0.85em; border-collapse:collapse;">
                            ${c.participants.map(p => `
                                <tr style="border-bottom:1px solid #eee;">
                                    <td style="padding:4px; font-weight:bold;">${p.num}</td>
                                    <td style="padding:4px;">${p.nom}</td>
                                    <td style="padding:4px; color:#666;">${p.musique}</td>
                                    <td style="padding:4px; text-align:right;">${p.cote || '-'}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                </details>
            </div>
        `;
        dom.container.appendChild(div);
    });
}

function buildRapportsTable(rapports) {
    if (!rapports || !Array.isArray(rapports)) return '<div style="color:#777; padding:10px;">Pas de rapports disponibles.</div>';

    // On cherche tout ce qui contient SIMPLE, COUPLE, TRIO, TIERCE
    // L'API Online met souvent "E_SIMPLE_GAGNANT", donc on filtre sur inclusion.
    const validKeys = ['SIMPLE', 'COUPLE', 'TRIO', 'TIERCE'];
    const hits = rapports.filter(r => validKeys.some(k => r.typePari.includes(k)));

    if (!hits.length) return '<div style="color:#777; padding:10px;">Rapports non publiés ou type non géré.</div>';

    let html = `<table class="reports-table">
        <thead><tr><th>Pari</th><th>Combinaison</th><th>Gain (1€)</th></tr></thead>
        <tbody>`;

    hits.forEach(r => {
        // Style du badge
        let cls = 'tag-couple';
        let lbl = r.libelle || r.typePari.replace('E_', ''); // Nettoyage du nom
        
        if (r.typePari.includes('GAGNANT')) cls = 'tag-win';
        else if (r.typePari.includes('PLACE')) cls = 'tag-place';
        else if (r.typePari.includes('TRIO') || r.typePari.includes('TIERCE')) cls = 'tag-trio';

        r.rapports.forEach(gain => {
            // CALCULE DU GAIN : L'API Online renvoie souvent en Centimes (dividendePourUnEuro)
            // Parfois dividendePourUnEuro n'existe pas, on fallback sur dividende/miseBase
            let val = 0;
            if (gain.dividendePourUnEuro) {
                val = gain.dividendePourUnEuro / 100;
            } else if (gain.dividende && r.miseBase) {
                val = (gain.dividende / r.miseBase); // Supposition miseBase en centimes aussi
            }
            
            html += `<tr>
                <td><span class="tag ${cls}">${lbl}</span></td>
                <td><b>${gain.combinaison}</b></td>
                <td class="gain-cell">${val.toFixed(2)} €</td>
            </tr>`;
        });
    });

    html += `</tbody></table>`;
    return html;
}

// --- UTILS ---

async function fetchAPI(url) {
    const res = await fetch(PROXY_URL + encodeURIComponent(url));
    if (!res.ok) {
        if (res.status === 404) return {}; 
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
}

function setStatus(dom, msg, type = 'status-loading', show = true) {
    dom.status.style.display = show ? 'block' : 'none';
    dom.status.className = `status-msg ${type}`;
    dom.status.innerText = msg;
}

function setLoading(dom, loading) {
    dom.fetch.disabled = loading;
    if(loading) setStatus(dom, "Chargement des données PMU...", 'status-loading');
}
