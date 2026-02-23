// ============================================================
//  MEDSWISS FINDER — script.js
// ============================================================

// ── MAP INIT ──────────────────────────────────────────────
const map = L.map('map', { zoomControl: false }).setView([46.6, 6.8], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

const clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
}).addTo(map);

const sidebarMarkers = {};
const gymLayer    = L.layerGroup().addTo(map);
const airportLayer = L.layerGroup().addTo(map);

// ── ICONS ─────────────────────────────────────────────────
const airportIcon = L.divIcon({
    className: 'airport-icon',
    html: `<div style="font-size:24px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.3));cursor:pointer;">✈️</div>`,
    iconSize:[30,30], iconAnchor:[15,15], popupAnchor:[0,-10]
});

// ── GEO HELPERS ───────────────────────────────────────────
const GVA_COORDS = { lat: 46.2304, lon: 6.1102 };

function calcDist(lat1, lon1, lat2, lon2) {
    const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getNearestAirport(lat, lon) {
    let nearest = null, minDist = Infinity;
    if (typeof AIRPORT_DATA !== 'undefined') {
        AIRPORT_DATA.forEach(a => {
            const d = calcDist(lat, lon, a.lat, a.lon);
            if (d < minDist) { minDist = d; nearest = a; }
        });
    }
    return { airport: nearest, distance: minDist };
}

function estimateTravelTime(distKm, airport) {
    const landTimeHours = (distKm / 60) + 0.5;
    const flightParts = airport.flightsToBarcelona.duration.match(/(\d+)h\s*(\d+)?/);
    let flightH = 1.5;
    if (flightParts) flightH = parseInt(flightParts[1]) + (parseInt(flightParts[2]||0)/60);
    const totalH = landTimeHours + 2.0 + flightH;
    return {
        totalHours: totalH.toFixed(1),
        landTime: Math.round(landTimeHours * 60),
        flightTime: airport.flightsToBarcelona.duration
    };
}

// ── SCORE CALCULATION ─────────────────────────────────────
// Max 100 pts: Category(40) + Accessibility(35) + Airport speed(25)
function calculateScore(hospital) {
    let score = 0;

    // Category
    if (hospital.categorie === 'B') score += 40;
    else if (hospital.categorie === 'C') score += 25;

    // Accessibility
    if      (hospital.accessibilite_etrangers === 'Alta')  score += 35;
    else if (hospital.accessibilite_etrangers === 'Mitjana') score += 20;
    else if (hospital.accessibilite_etrangers === 'Baixa')  score += 5;

    // Airport proximity (parse "XX min" or "Xh YYmin" from temps_aeroport)
    const t = hospital.temps_aeroport || '';
    const hMatch = t.match(/(\d+)h/);
    const mMatch = t.match(/(\d+)\s*min/);
    let totalMin = 0;
    if (hMatch) totalMin += parseInt(hMatch[1]) * 60;
    if (mMatch) totalMin += parseInt(mMatch[1]);
    if (!hMatch && !mMatch) totalMin = 120; // fallback

    if      (totalMin < 20)  score += 25;
    else if (totalMin < 45)  score += 20;
    else if (totalMin < 75)  score += 14;
    else if (totalMin < 120) score += 9;
    else                     score += 4;

    return Math.min(score, 100);
}

function scoreColor(s) {
    if (s >= 80) return '#10b981'; // emerald
    if (s >= 60) return '#f59e0b'; // amber
    return '#ef4444';               // red
}

// ── RATINGS (sidebar cards) ───────────────────────────────
const ratingsCache = {};

function getRatings(hospital, siteAddress) {
    const key = hospital.nom + siteAddress;
    if (ratingsCache[key]) return ratingsCache[key];

    const jobChance = Math.floor(Math.random() * 3) + 7;
    const locationRating = Math.floor(Math.random() * 2) + 8;
    let airportScore = 5;
    let transportInfo = null;

    const coords = ADDRESS_COORDINATES[siteAddress];
    if (coords) {
        const dist = calcDist(coords[0], coords[1], GVA_COORDS.lat, GVA_COORDS.lon);
        if (dist < 20) airportScore = 10;
        else if (dist < 50) airportScore = 8;
        else if (dist < 100) airportScore = 6;

        const nearest = getNearestAirport(coords[0], coords[1]);
        if (nearest.airport) {
            transportInfo = estimateTravelTime(nearest.distance, nearest.airport);
            transportInfo.airportName = nearest.airport.code;
        }
    }

    const result = { job: jobChance, location: locationRating, airport: airportScore, barcelona: airportScore, transport: transportInfo };
    ratingsCache[key] = result;
    return result;
}

// ── STATE ─────────────────────────────────────────────────
let currentAppData = null;
let favorites = JSON.parse(localStorage.getItem('medswiss_favs') || '[]');
let searchQuery = '';

const state = {
    filters: { canton: 'all', categorie: 'all', accessibilite: 'all', langue: 'all' },
    sort: 'score'
};

// ── FILTER + SORT ─────────────────────────────────────────
function parseMinutes(t) {
    if (!t) return 999;
    const h = t.match(/(\d+)h/);
    const m = t.match(/(\d+)\s*min/);
    let tot = 0;
    if (h) tot += parseInt(h[1]) * 60;
    if (m) tot += parseInt(m[1]);
    return tot || 999;
}

function matchesSearch(hospital) {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (hospital.nom.toLowerCase().includes(q)) return true;
    return hospital.sites.some(s => s.ville.toLowerCase().includes(q));
}

function applyFiltersAndSort(data) {
    let cantons = JSON.parse(JSON.stringify(data.suisse_francophone));

    cantons = cantons.map(cantonData => {
        if (state.filters.canton !== 'all' && cantonData.canton !== state.filters.canton) return null;

        let hospitals = cantonData.hopitaux.filter(h => {
            if (state.filters.categorie !== 'all' && h.categorie !== state.filters.categorie) return false;
            if (state.filters.accessibilite !== 'all' && h.accessibilite_etrangers !== state.filters.accessibilite) return false;
            if (state.filters.langue !== 'all') {
                if (!h.langue_requise) return false;
                if (!h.langue_requise.includes(state.filters.langue)) return false;
            }
            if (!matchesSearch(h)) return false;
            return true;
        });

        if (state.sort === 'alpha') {
            hospitals.sort((a, b) => a.nom.localeCompare(b.nom));
        } else if (state.sort === 'distance') {
            hospitals.sort((a, b) => parseMinutes(a.temps_aeroport) - parseMinutes(b.temps_aeroport));
        } else if (state.sort === 'score') {
            hospitals.sort((a, b) => calculateScore(b) - calculateScore(a));
        }

        return hospitals.length ? { ...cantonData, hopitaux: hospitals } : null;
    }).filter(Boolean);

    return cantons;
}

// ── FAVORITES ─────────────────────────────────────────────
function isFav(nom) { return favorites.includes(nom); }

function toggleFav(nom, btn) {
    if (isFav(nom)) {
        favorites = favorites.filter(f => f !== nom);
        btn.classList.remove('active');
    } else {
        favorites.push(nom);
        btn.classList.add('active');
    }
    localStorage.setItem('medswiss_favs', JSON.stringify(favorites));
    if (document.getElementById('tab-favs').classList.contains('active-tab')) {
        renderFavs();
    }
}

// ── CARD BUILDER ──────────────────────────────────────────
function buildCard(hospital, hospitalId, cantonSection, cantonIndex, hospitalIndex) {
    const mainSite = hospital.sites[0];
    const ratings  = getRatings(hospital, mainSite.adresse);
    const score    = calculateScore(hospital);
    const color    = scoreColor(score);
    const pct      = (score / 100 * 360).toFixed(1) + 'deg';
    const faved    = isFav(hospital.nom);

    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.id = `card-${hospitalId}`;
    card.style.animationDelay = `${hospitalIndex * 0.04}s`;

    const sitesHtml = hospital.sites.map(s =>
        `<span class="site-badge"><i class="fas fa-map-marker-alt"></i>${s.ville}</span>`
    ).join('');

    let transportHtml = '';
    if (ratings.transport) {
        transportHtml = `
        <div class="transport-pill">
            <i class="fas fa-plane-departure"></i>
            <span>Via <strong>${ratings.transport.airportName}</strong> → BCN :
            <strong>~${ratings.transport.totalHours}h</strong> total
            <span style="opacity:0.7">(${ratings.transport.flightTime} vol)</span></span>
        </div>`;
    } else if (hospital.aeroport_proche && hospital.temps_aeroport) {
        transportHtml = `
        <div class="transport-pill">
            <i class="fas fa-clock"></i>
            <span>${hospital.aeroport_proche} : <strong>${hospital.temps_aeroport}</strong></span>
        </div>`;
    }

    // Contacte / Career links
    let emailHref = hospital.email_contact ? `mailto:${hospital.email_contact}` :
        `https://www.google.com/search?q=postuler+médecin+assistant+${encodeURIComponent(hospital.nom)}`;

    // Career portal heuristic
    const careerSearch = `https://www.google.com/search?q=offre+emploi+médecin+assistant+${encodeURIComponent(hospital.nom)}`;

    const accessClass = hospital.accessibilite_etrangers === 'Élevée' ? 'access-high' :
                        hospital.accessibilite_etrangers === 'Moyenne' ? 'access-med' : 'access-low';

    card.innerHTML = `
        <div class="card-top">
            <div style="flex:1;">
                <h4 class="card-title">${hospital.nom}</h4>
                ${hospital.chef_service ? `<div style="font-size:0.76rem;color:var(--text-muted);margin-top:3px;">
                    <i class="fas fa-user-md" style="width:14px;"></i> ${hospital.chef_service}</div>` : ''}
            </div>
            <div class="card-actions-top">
                <button class="fav-btn ${faved ? 'active' : ''}" 
                    onclick="event.stopPropagation(); toggleFav('${hospital.nom.replace(/'/g,"\\'")}', this)"
                    title="Ajouter aux favoris">
                    <i class="fa${faved ? 's' : 'r'} fa-heart"></i>
                </button>
                <div class="score-ring" style="--score-color:${color};--score-pct:${pct};">
                    <div class="score-ring-inner" style="--score-color:${color};">${score}</div>
                </div>
            </div>
        </div>

        <div class="meta-badges">
            ${hospital.categorie ? `<span class="meta-badge cat-${hospital.categorie.toLowerCase()}"><i class="fas fa-certificate"></i> Cat. ${hospital.categorie}</span>` : ''}
            ${hospital.accessibilite_etrangers ? `<span class="meta-badge ${accessClass}"><i class="fas fa-globe"></i> ${hospital.accessibilite_etrangers}</span>` : ''}
            ${hospital.langue_requise ? `<span class="meta-badge dist"><i class="fas fa-language"></i> FR ${hospital.langue_requise}</span>` : ''}
            ${hospital.temps_aeroport ? `<span class="meta-badge dist"><i class="fas fa-plane"></i> ${hospital.aeroport_proche} ${hospital.temps_aeroport}</span>` : ''}
        </div>

        <p class="card-description">${hospital.description}</p>
        
        ${hospital.encadrement_niveau ? `
        <div class="encadrement-block">
            <div class="encad-title"><i class="fas fa-chalkboard-teacher"></i> Supervisió: <strong>${hospital.encadrement_niveau}</strong></div>
            <div class="encad-desc">${hospital.encadrement_desc}</div>
        </div>
        ` : ''}

        <div class="sites-container">${sitesHtml}</div>

        ${transportHtml}

        <div class="card-link-row">
            <a href="${emailHref}" target="_blank" class="card-link-btn" onclick="event.stopPropagation()">
                <i class="fas fa-envelope"></i> Contacte
            </a>
            <a href="${careerSearch}" target="_blank" class="card-link-btn" onclick="event.stopPropagation()">
                <i class="fas fa-briefcase"></i> Ofertes
            </a>
            <button class="card-link-btn red" onclick="event.stopPropagation(); openCoverLetterModal('${hospital.nom.replace(/'/g,"\\'")}')">
                <i class="fas fa-magic"></i> Carta IA
            </button>
        </div>
    `;

    // Card click → fly to map
    card.onclick = () => {
        document.querySelectorAll('.hospital-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const marker = sidebarMarkers[hospitalId];
        if (marker) {
            if (!mapVisible) toggleMap(); // open map if closed
            clusterGroup.zoomToShowLayer(marker, () => {
                marker.openPopup();
                map.flyTo(marker.getLatLng(), 14, { duration: 1.2 });
            });
        }
    };

    cantonSection.appendChild(card);

    // Map markers
    hospital.sites.forEach((site, si) => {
        const coords = ADDRESS_COORDINATES[site.adresse];
        if (!coords) return;
        const marker = L.marker(coords);

        const accessBadge = hospital.accessibilite_etrangers ?
            `<span class="meta-badge ${accessClass}" style="font-size:0.7rem;padding:2px 6px;">${hospital.accessibilite_etrangers}</span>` : '';
        const catBadge = hospital.categorie ?
            `<span class="meta-badge cat-${hospital.categorie.toLowerCase()}" style="font-size:0.7rem;padding:2px 6px;">Cat. ${hospital.categorie}</span>` : '';
        const scoreBadge = `<span class="meta-badge" style="background:${color}20;color:${color};font-size:0.7rem;padding:2px 6px;">Puntuació: ${score}/100</span>`;

        marker.bindPopup(`
            <div class="popup-content">
                <div class="popup-title">${hospital.nom}</div>
                <div class="popup-badge-row">${catBadge}${accessBadge}${scoreBadge}</div>
                <div class="popup-subtitle">${site.ville}</div>
                <div class="popup-text">
                    ${hospital.temps_aeroport ? `<i class="fas fa-plane"></i> ${hospital.aeroport_proche} : ${hospital.temps_aeroport}<br>` : ''}
                    ${hospital.langue_requise ? `<i class="fas fa-language"></i> Idioma requerit: FR ${hospital.langue_requise}<br>` : ''}
                    ${hospital.encadrement_niveau ? `<i class="fas fa-chalkboard-teacher"></i> Supervisió: <strong>${hospital.encadrement_niveau}</strong>` : ''}
                </div>
            </div>
        `);

        marker.on('click', () => {
            const targetCard = document.getElementById(`card-${hospitalId}`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.querySelectorAll('.hospital-card').forEach(c => c.classList.remove('active'));
                targetCard.classList.add('active');
            }
        });

        clusterGroup.addLayer(marker);
        if (si === 0) sidebarMarkers[hospitalId] = marker;
    });
}

// ── MAIN RENDER ───────────────────────────────────────────
function initHospitalData() {
    if (!currentAppData) return;

    clusterGroup.clearLayers();
    for (const k in sidebarMarkers) delete sidebarMarkers[k];

    const hospitalList = document.getElementById('hospitals-list');
    hospitalList.innerHTML = '';

    // Airports (render once)
    if (airportLayer.getLayers().length === 0 && typeof AIRPORT_DATA !== 'undefined') {
        AIRPORT_DATA.forEach(airport => {
            const marker = L.marker([airport.lat, airport.lon], { icon: airportIcon });
            marker.bindPopup(`
                <div class="popup-content" style="min-width:220px;">
                    <div class="popup-title">✈️ ${airport.name}</div>
                    <div class="popup-subtitle">Vols a Barcelona (BCN)</div>
                    <div class="popup-text">
                        <strong>Durada:</strong> ${airport.flightsToBarcelona.duration}<br>
                        <strong>Freqüència:</strong> ${airport.flightsToBarcelona.frequency}<br>
                        <strong>Preu:</strong> ${airport.flightsToBarcelona.avgPrice}
                    </div>
                </div>
            `);
            airportLayer.addLayer(marker);
        });
    }

    const filteredData = applyFiltersAndSort(currentAppData);
    let totalCount = 0;
    filteredData.forEach(c => totalCount += c.hopitaux.length);
    const meta = document.getElementById('results-count');
    if (meta) meta.textContent = `${totalCount} establiment${totalCount > 1 ? 's' : ''} trobat${totalCount > 1 ? 's' : ''}`;

    if (filteredData.length === 0) {
        hospitalList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Cap hospital no coincideix amb aquests criteris.</p>
                <button onclick="resetFilters()" class="secondary-btn">Reiniciar filtres</button>
            </div>`;
        return;
    }

    filteredData.forEach((cantonData, ci) => {
        const section = document.createElement('div');
        section.className = 'canton-section';
        section.innerHTML = `
            <div class="canton-header">
                <h3 class="canton-title">
                    ${cantonData.canton}
                    <span class="canton-badge">${cantonData.hopitaux.length} hosp.</span>
                </h3>
            </div>`;
        hospitalList.appendChild(section);

        cantonData.hopitaux.forEach((hospital, hi) => {
            buildCard(hospital, `h-${ci}-${hi}`, section, ci, hi);
        });
    });
}

// ── FAVS RENDER ───────────────────────────────────────────
function renderFavs() {
    const list = document.getElementById('favs-list');
    list.innerHTML = '';
    if (favorites.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-heart"></i><p>Encara no hi ha favorits.<br>Fes clic a ♡ a una fitxa.</p></div>`;
        return;
    }
    let ci = 0;
    currentAppData.suisse_francophone.forEach(canton => {
        canton.hopitaux.forEach((h, hi) => {
            if (favorites.includes(h.nom)) {
                const dummy = document.createElement('div');
                dummy.className = 'canton-section';
                list.appendChild(dummy);
                buildCard(h, `fav-${ci++}`, dummy, 0, hi);
            }
        });
    });
}

// ── SEARCH ────────────────────────────────────────────────
window.onSearchInput = function() {
    const input = document.getElementById('search-input');
    searchQuery = input.value.trim();
    document.getElementById('search-clear').style.display = searchQuery ? 'flex' : 'none';
    initHospitalData();
};

window.clearSearch = function() {
    document.getElementById('search-input').value = '';
    searchQuery = '';
    document.getElementById('search-clear').style.display = 'none';
    initHospitalData();
};

// ── FILTERS ───────────────────────────────────────────────
function setupFilters() {
    const ids = ['filter-canton','filter-categorie','filter-accessibilite','filter-langue','sort-hospitals'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', () => {
            state.filters.canton        = document.getElementById('filter-canton').value;
            state.filters.categorie     = document.getElementById('filter-categorie').value;
            state.filters.accessibilite = document.getElementById('filter-accessibilite').value;
            state.filters.langue        = document.getElementById('filter-langue').value;
            state.sort                  = document.getElementById('sort-hospitals').value;
            initHospitalData();
        });
    });
}

window.resetFilters = function() {
    ['filter-canton','filter-categorie','filter-accessibilite','filter-langue'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = 'all';
    });
    const sort = document.getElementById('sort-hospitals');
    if (sort) sort.value = 'score';
    state.filters = { canton:'all', categorie:'all', accessibilite:'all', langue:'all' };
    state.sort = 'score';
    initHospitalData();
};

// ── TAB SWITCHING ─────────────────────────────────────────
let currentTab = 'hospitals';

window.switchTab = function(tab) {
    currentTab = tab;

    const filters    = document.getElementById('hospital-filters');
    const searchWrap = document.querySelector('.search-bar-wrap');
    if (filters)    filters.style.display    = tab === 'hospitals' ? '' : 'none';
    if (searchWrap) searchWrap.style.display = tab === 'hospitals' ? '' : 'none';

    ['hospitals','airports','favs'].forEach(t => {
        const btn  = document.getElementById(`tab-${t}`);
        const list = document.getElementById(`${t}-list`);
        if (btn)  btn.classList.toggle('active', t === tab);
        if (list) list.style.display = t === tab ? 'flex' : 'none';
    });

    if (tab === 'favs') renderFavs();
};

// ── AIRPORT LIST ──────────────────────────────────────────
function initAirportData() {
    const list = document.getElementById('airports-list');
    list.innerHTML = '';
    if (typeof AIRPORT_DATA === 'undefined') return;

    AIRPORT_DATA.forEach(airport => {
        const card = document.createElement('div');
        card.className = 'airport-card';
        card.innerHTML = `
            <div class="airport-header">
                <span class="airport-name">${airport.name}</span>
                <span class="airport-code">${airport.code}</span>
            </div>
            <div class="airport-body">
                <div class="flight-route">
                    <div class="route-point">${airport.code}<span>Suïssa</span></div>
                    <div class="flight-line"></div>
                    <div class="route-point">BCN<span>Barcelona</span></div>
                </div>
                <div class="flight-stats">
                    <div class="stat-item">
                        <span class="stat-value">${airport.flightsToBarcelona.duration}</span>
                        <span class="stat-label">Durada vol</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${airport.flightsToBarcelona.avgPrice}</span>
                        <span class="stat-label">Preu est.</span>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <span class="stat-label">Companyies</span>
                    <div class="airline-badges">
                        ${airport.flightsToBarcelona.airlines.map(a => `<span class="airline-badge">✈ ${a}</span>`).join('')}
                    </div>
                </div>
                <div style="margin-bottom:12px;font-size:0.85rem;color:var(--text-muted);">
                    <i class="fas fa-train" style="color:var(--accent-color);margin-right:6px;"></i>
                    ${airport.transport.description}
                </div>
                <a href="${airport.website}" target="_blank" class="airport-action-btn">
                    <i class="fas fa-ticket-alt"></i> Veure Vols i Horaris
                </a>
            </div>`;

        card.onclick = e => {
            if (e.target.closest('a')) return;
            map.flyTo([airport.lat, airport.lon], 13, { duration: 1.5 });
            airportLayer.eachLayer(l => {
                if (Math.abs(l.getLatLng().lat - airport.lat) < 0.001) l.openPopup();
            });
        };

        list.appendChild(card);
    });
}

// ── COVER LETTER MODAL ────────────────────────────────────
const modal = document.getElementById('cover-letter-modal');
const closeBtn = document.querySelector('.close-modal');
if (closeBtn) closeBtn.onclick = () => modal.classList.remove('open');
window.onclick = e => { if (e.target === modal) modal.classList.remove('open'); };

window.openCoverLetterModal = function(name) {
    document.getElementById('modal-hospital-name').innerText = name;
    modal.classList.add('open');
    document.getElementById('generation-result').style.display = 'none';
};

const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

if (generateBtn) {
    const saved = localStorage.getItem('ai_api_key');
    if (saved) document.getElementById('api-key').value = saved;

    generateBtn.onclick = async function() {
        const apiKey      = document.getElementById('api-key').value;
        const userName    = document.getElementById('user-name').value;
        const userDetails = document.getElementById('user-details').value;
        const hospName    = document.getElementById('modal-hospital-name').innerText;
        const model       = document.getElementById('model-select').value;
        const resultArea  = document.getElementById('generation-result');
        const finalLetter = document.getElementById('final-letter');

        if (!apiKey) { alert('Si us plau, introduïu una clau API.'); return; }
        localStorage.setItem('ai_api_key', apiKey);

        generateBtn.textContent = 'Generant…';
        generateBtn.disabled = true;

        const prompt = `Rédige une lettre de motivation professionnelle, formelle et personnalisée pour un poste de Médecin Assistant en Médecine Interne à l'hôpital ${hospName} en Suisse. Candidat: ${userName}. Informations: ${userDetails}. Langue: Français.`;

        try {
            let text = '';
            if (model.includes('gpt')) {
                const r = await fetch('https://api.openai.com/v1/chat/completions', {
                    method:'POST',
                    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
                    body: JSON.stringify({ model, messages:[{role:'user',content:prompt}], temperature:0.7 })
                });
                const d = await r.json();
                if (d.error) throw new Error(d.error.message);
                text = d.choices[0].message.content;
            } else {
                const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                    method:'POST',
                    headers:{ 'Content-Type':'application/json' },
                    body: JSON.stringify({ contents:[{ parts:[{text:prompt}] }] })
                });
                const d = await r.json();
                if (d.error) throw new Error(d.error.message);
                text = d.candidates[0].content.parts[0].text;
            }
            finalLetter.value = text;
            resultArea.style.display = 'block';
        } catch(err) {
            alert('Error: ' + err.message);
        } finally {
            generateBtn.textContent = 'Generar la Carta';
            generateBtn.disabled = false;
        }
    };
}

if (copyBtn) {
    copyBtn.onclick = () => {
        document.getElementById('final-letter').select();
        document.execCommand('copy');
        copyBtn.textContent = '✓ Copiat!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar'; }, 2000);
    };
}

// ── DARK MODE ─────────────────────────────────────────────
window.toggleDarkMode = function() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const icon = document.querySelector('#dark-toggle-btn i');
    if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('medswiss_theme', isDark ? 'light' : 'dark');
};

// Apply saved theme
(function() {
    const saved = localStorage.getItem('medswiss_theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        const icon = document.querySelector('#dark-toggle-btn i');
        if (icon) icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
})();

// ── EXPORT CSV ────────────────────────────────────────────
window.exportCSV = function() {
    if (!currentAppData) return;
    const filtered = applyFiltersAndSort(currentAppData);
    const rows = [['Nom','Cantó','Categoria','Accessibilitat','Idioma','Aeroport','Temps aeroport','Puntuació','Email','Cap de servei']];
    filtered.forEach(c => {
        c.hopitaux.forEach(h => {
            rows.push([
                `"${h.nom}"`, `"${c.canton}"`, h.categorie||'',
                h.accessibilite_etrangers||'', h.langue_requise||'',
                h.aeroport_proche||'', h.temps_aeroport||'',
                calculateScore(h),
                h.email_contact||'', `"${h.chef_service||''}"`
            ]);
        });
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'medswiss_hopitaux.csv'; a.click();
    URL.revokeObjectURL(url);
};

// ── MAP TOGGLE (Airbnb-style) ─────────────────────────────
let mapVisible = true;

window.toggleMap = function() {
    const panel = document.getElementById('map-panel');
    const label = document.getElementById('map-toggle-label');
    const btn   = document.getElementById('map-toggle-btn');

    mapVisible = !mapVisible;

    // Toggle map panel
    panel.classList.toggle('collapsed', !mapVisible);

    // Sidebar expands when map is hidden
    document.body.classList.toggle('map-hidden', !mapVisible);

    if (mapVisible) {
        label.textContent = 'Amagar el mapa';
        btn.querySelector('i').className = 'fas fa-map-marked-alt';
    } else {
        label.textContent = 'Mostrar el mapa';
        btn.querySelector('i').className = 'fas fa-map';
    }

    // Let Leaflet re-measure after transition
    setTimeout(() => map.invalidateSize(), 380);
};

// ── INITIALIZE ────────────────────────────────────────────
if (typeof HOSPITAL_DATA !== 'undefined') {
    currentAppData = HOSPITAL_DATA;
    setupFilters();
    initHospitalData();
}

if (typeof AIRPORT_DATA !== 'undefined') {
    initAirportData();
}
