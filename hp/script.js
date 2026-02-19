// Initialize Map
const map = L.map('map', {
    zoomControl: false // We'll add it elsewhere or style it if needed
}).setView([46.6, 6.8], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

const clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    // Custom cluster icon could be added here for extra polish
}).addTo(map);

const sidebarMarkers = {};

// Custom Icons
const hospitalIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: var(--primary-color); width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
});

const gymIcon = L.divIcon({
    className: 'gym-icon',
    html: `<div style="font-size: 20px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">🏋️</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10]
});

// Gym Layer Group
const gymLayer = L.layerGroup().addTo(map);

function initHospitalData(data) {
    const hospitalList = document.getElementById('hospital-list');
    hospitalList.innerHTML = '';

    // Render Gyms
   /* if (typeof GYM_DATA !== 'undefined') {
        GYM_DATA.forEach(gym => {
            const marker = L.marker([gym.lat, gym.lon], { icon: gymIcon });
            marker.bindPopup(`
                <div class="popup-content">
                    <div class="popup-title">🏋️ ${gym.name}</div>
                    <div class="popup-text">Salle de sport à proximité</div>
                </div>
            `);
            gymLayer.addLayer(marker);
        });
    }*/

    data.suisse_francophone.forEach((cantonData, cantonIndex) => {
        const cantonSection = document.createElement('div');
        cantonSection.className = 'canton-section';
        
        cantonSection.innerHTML = `
            <div class="canton-header">
                <h3 class="canton-title">
                    ${cantonData.canton}
                    <span class="canton-badge">${cantonData.hopitaux.length} Hôpitaux</span>
                </h3>
            </div>
            <div class="canton-description">${cantonData.description}</div>
        `;
        hospitalList.appendChild(cantonSection);

        cantonData.hopitaux.forEach((hospital, hospitalIndex) => {
            const hospitalId = `h-${cantonIndex}-${hospitalIndex}`;
            
            const card = document.createElement('div');
            card.className = 'hospital-card';
            card.id = `card-${hospitalId}`;
            
            // Staggered animation delay
            card.style.animationDelay = `${(hospitalIndex * 0.05)}s`;
            
            const sitesHtml = hospital.sites.map(site => `
                <span class="site-badge">
                    <i class="fas fa-map-marker-alt"></i>${site.ville}
                </span>
            `).join('');
            
            card.innerHTML = `
                <div class="card-content">
                    <h4>
                        ${hospital.nom}
                        <span class="card-arrow">→</span>
                    </h4>
                    <p class="card-description">${hospital.description}</p>
                    <div class="sites-container">${sitesHtml}</div>
                </div>
            `;
            
            // Interaction: Card Click
            card.onclick = () => {
                // Remove active class from all cards
                document.querySelectorAll('.hospital-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const marker = sidebarMarkers[hospitalId];
                if (marker) {
                    clusterGroup.zoomToShowLayer(marker, () => {
                        marker.openPopup();
                        map.flyTo(marker.getLatLng(), 15, {
                            duration: 1.5
                        });
                    });
                }
            };
            
            cantonSection.appendChild(card);

            // Create Markers
            hospital.sites.forEach((site, siteIndex) => {
                // We use global ADDRESS_COORDINATES from data.js
                const siteCoords = ADDRESS_COORDINATES[site.adresse];
                
                if (siteCoords) {
                    const marker = L.marker(siteCoords);
                    // Standard icon for now, can be replaced with hospitalIcon if desired
                    
                    const popupContent = `
                        <div class="popup-content">
                            <div class="popup-title">${hospital.nom}</div>
                            <div class="popup-subtitle">${site.ville}</div>
                            <div class="popup-text">${site.adresse}</div>
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                    
                    // Interaction: Marker Click
                    marker.on('click', () => {
                        // Scroll sidebar to card
                        const targetCard = document.getElementById(`card-${hospitalId}`);
                        if (targetCard) {
                            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            document.querySelectorAll('.hospital-card').forEach(c => c.classList.remove('active'));
                            targetCard.classList.add('active');
                        }
                    });

                    clusterGroup.addLayer(marker);
                    
                    // Link the first site marker to the card for zooming
                    if (siteIndex === 0) {
                        sidebarMarkers[hospitalId] = marker;
                    }
                }
            });
        });
    });
}

// Initialize
if (typeof HOSPITAL_DATA !== 'undefined') {
    initHospitalData(HOSPITAL_DATA);
}
