/**
 * scriptpmu.js - Version PDF Ready
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
        print: document.getElementById('printBtn'),
        actionBar: document.getElementById('actionBar'),
        status: document.getElementById('status'),
        container: document.getElementById('resultsContainer')
    };

    if (!dom.fetch) return;

    // 1. CHARGEMENT
    dom.fetch.addEventListener('click', async () => {
        const date = dom.date.value.trim();
        const rStr = dom.reunion.value.trim().toUpperCase();
        const rNum = rStr.replace(/\D/g, '');

        if (!date || !rNum) return alert('Date et Réunion requises');

        setLoading(dom, true);
        dom.container.innerHTML = '';
        dom.actionBar.style.display = 'none'; // Cacher boutons

        globalData = { meta: { date, reunion: rStr }, courses: [] };

        try {
            const progData = await fetchAPI(`${API_BASE}/${date}/R${rNum}`);
            if (!progData.courses) throw new Error("Réunion introuvable.");

            const tasks = progData.courses.map(c => processCourse(date, rNum, c));
            globalData.courses = await Promise.all(tasks);
            globalData.courses.sort((a, b) => a.num - b.num);

            renderUI(dom, globalData.courses);
            
            // Mise à jour pour le PDF
            document.title = `PMU_${date}_${rStr}`; 
            
            dom.actionBar.style.display = 'block'; // Afficher boutons
            setStatus(dom, `${globalData.courses.length} courses chargées.`, 'status-loading', false);

        } catch (e) {
            console.error(e);
            setStatus(dom, "Erreur : " + e.message, 'status-error');
        } finally {
            setLoading(dom, false);
        }
    });

    // 2. EXPORT JSON
    dom.export.addEventListener('click', () => {
        if (!globalData) return;
        const blob = new Blob([JSON.stringify(globalData, null, 2)], {type: 'application/json;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `PMU_${globalData.meta.date}_${globalData.meta.reunion}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 3. IMPRESSION / PDF
    dom.print.addEventListener('click', () => {
        window.print();
    });
});

async function processCourse(date, rNum, cInfo) {
    const cNum = cInfo.numOrdre;
    
    const [partants, rapports] = await Promise.all([
        fetchAPI(`${API_BASE}/${date}/R${rNum}/C${cNum}/participants`).catch(() => ({ participants: [] })),
        fetchAPI(`${API_BASE}/${date}/R${rNum}/C${cNum}/rapports-definitifs`).catch(() => null)
    ]);

    // MAP PARTICIPANTS (FIX NOM)
    const parts = (partants.participants || []).map(p => ({
        num: p.numPmu,
        // Sécurité sur le nom : nomCheval OU nom
        nom: p.nomCheval || p.nom || "Nom Inconnu", 
        driver: p.driver || p.jockey || "-",
        entraineur: p.entraineur || "-",
        musique: p.musique || "-",
        cote: p.dernierRapportDirect ? p.dernierRapportDirect.rapport : null
    }));

    const conditions = Array.isArray(cInfo.conditions) ? cInfo.conditions.join(". ") : (cInfo.conditions || "");

    return {
        id: `R${rNum}C${cNum}`,
        num: cNum,
        nom: cInfo.libelle,
        heure: cInfo.heureDepart,
        discipline: cInfo.discipline,
        arrivee: cInfo.ordreArrivee || [],
        terrain: {
            nature: cInfo.etatTerrain || "Non renseigné",
            penetrometre: cInfo.valeurPenetrometre || "-"
        },
        conditions: conditions,
        participants: parts,
        rapports: rapports
    };
}

function renderUI(dom, courses) {
    courses.forEach(c => {
        const div = document.createElement('div');
        div.className = 'race-card';

        const heure = new Date(c.heure).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        const arriveeTxt = c.arrivee.length ? c.arrivee.join(' - ') : 'En cours';

        const htmlRapports = buildRapportsTable(c.rapports);
        const htmlPartants = buildPartantsTable(c.participants);

        div.innerHTML = `
            <div class="race-header">
                <span class="race-title">C${c.num} - ${c.nom}</span>
                <span>${heure}</span>
            </div>
            <div class="race-body">
                <div class="meta-box">
                    <div>
                        <strong>Discipline :</strong> ${c.discipline}<br>
                        <strong>Arrivée :</strong> <span style="color:#d63384; font-weight:bold;">${arriveeTxt}</span>
                    </div>
                    <div>
                        <strong>Terrain :</strong> ${c.terrain.nature} (${c.terrain.penetrometre})<br>
                        <strong>Partants :</strong> ${c.participants.length}
                    </div>
                    <div class="conditions-text">${c.conditions}</div>
                </div>

                <h4>Rapports (1€)</h4>
                ${htmlRapports}

                <h4>Partants</h4>
                ${htmlPartants}
            </div>
        `;
        dom.container.appendChild(div);
    });
}

function buildPartantsTable(participants) {
    if (!participants || participants.length === 0) return '<p>Aucun participant.</p>';

    let html = `<table class="participants-table">
        <thead>
            <tr>
                <th style="width:40px; text-align:center;">N°</th>
                <th>Cheval</th>
                <th>Driver / Jockey</th>
                <th>Musique</th>
                <th style="width:60px; text-align:right;">Cote</th>
            </tr>
        </thead>
        <tbody>`;

    participants.forEach(p => {
        html += `
            <tr>
                <td style="text-align:center; font-weight:bold;">${p.num}</td>
                <td><strong>${p.nom}</strong></td>
                <td>${p.driver}</td>
                <td style="font-size:0.85em; color:#555;">${p.musique}</td>
                <td style="text-align:right; font-weight:bold; color:#0056b3;">${p.cote || '-'}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

function buildRapportsTable(rapports) {
    if (!rapports || !Array.isArray(rapports)) return '<p style="color:#777; font-style:italic">Rapports non disponibles.</p>';

    const keys = ['SIMPLE', 'COUPLE', 'TRIO', 'TIERCE'];
    const hits = rapports.filter(r => keys.some(k => r.typePari.includes(k)));

    if (!hits.length) return '<p style="color:#777; font-style:italic">Pas de rapports affichables.</p>';

    let html = `<table class="reports-table">
        <thead>
            <tr>
                <th>Pari</th>
                <th>Combinaison</th>
                <th>Gain</th>
            </tr>
        </thead>
        <tbody>`;

    hits.forEach(r => {
        let badge = 'badge-couple';
        let lbl = r.libelle || r.typePari.replace('E_','');
        if (r.typePari.includes('GAGNANT')) badge = 'badge-win';
        else if (r.typePari.includes('PLACE')) badge = 'badge-place';
        else if (r.typePari.includes('TRIO') || r.typePari.includes('TIERCE')) badge = 'badge-trio';

        r.rapports.forEach(g => {
            let val = g.dividendePourUnEuro ? g.dividendePourUnEuro / 100 : (g.dividende / (r.miseBase || 100));
            html += `<tr>
                <td><span class="badge ${badge}">${lbl}</span></td>
                <td><b>${g.combinaison}</b></td>
                <td class="gain-cell">${val.toFixed(2)} €</td>
            </tr>`;
        });
    });

    html += `</tbody></table>`;
    return html;
}

async function fetchAPI(url) {
    const res = await fetch(PROXY_URL + encodeURIComponent(url));
    if (!res.ok) { if(res.status === 404) return {}; throw new Error(`HTTP ${res.status}`); }
    return await res.json();
}
function setStatus(dom, msg, type, show = true) {
    dom.status.style.display = show ? 'block' : 'none';
    dom.status.className = type;
    dom.status.innerText = msg;
}
function setLoading(dom, loading) {
    dom.fetch.disabled = loading;
    if(loading) setStatus(dom, "Chargement...", 'status-loading');
}
