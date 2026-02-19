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

const airportIcon = L.divIcon({
    className: 'airport-icon',
    html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3)); cursor: pointer;">✈️</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10]
});

// Layers
const gymLayer = L.layerGroup().addTo(map);
const airportLayer = L.layerGroup().addTo(map);

// Reference coordinates for ratings (GVA Airport)
const GVA_COORDS = { lat: 46.2304, lon: 6.1102 };

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
}

function getNearestAirport(lat, lon) {
    let nearest = null;
    let minDist = Infinity;

    if (typeof AIRPORT_DATA !== 'undefined') {
        AIRPORT_DATA.forEach(airport => {
            const dist = calculateDistance(lat, lon, airport.lat, airport.lon);
            if (dist < minDist) {
                minDist = dist;
                nearest = airport;
            }
        });
    }
    return { airport: nearest, distance: minDist };
}

function estimateTravelTime(distanceKm, airport) {
    // 1. Hospital -> Airport (Assume 60km/h avg speed by train/car + 30 min buffer)
    const landTimeHours = (distanceKm / 60) + 0.5;
    
    // 2. Airport Buffer (Check-in, Security)
    const airportBuffer = 2.0;

    // 3. Flight Time (Extract minutes from string "1h 35min")
    const flightDurationParts = airport.flightsToBarcelona.duration.match(/(\d+)h\s*(\d+)?/);
    let flightHours = 1.5; // Default fallback
    if (flightDurationParts) {
        flightHours = parseInt(flightDurationParts[1]) + (parseInt(flightDurationParts[2] || 0) / 60);
    }

    const totalHours = landTimeHours + airportBuffer + flightHours;
    return {
        totalHours: totalHours.toFixed(1),
        landTime: Math.round(landTimeHours * 60), // minutes
        flightTime: airport.flightsToBarcelona.duration
    };
}

function getRatings(hospital, siteAddress) {
    // 1. Job Chance (Randomized for now, biased by hospital "size" heuristic if possible, or just random)
    const jobChance = Math.floor(Math.random() * 3) + 7; // 7 to 9

    // 2. Location Rating (Random high value for Switzerland)
    const locationRating = Math.floor(Math.random() * 2) + 8; // 8 to 9

    // 3. Transport & Airport & Barcelona Link
    // We use distance to GVA as a proxy for "Direct Link to Barcelona" since GVA has many flights.
    let airportScore = 0;
    const coords = ADDRESS_COORDINATES[siteAddress];
    let transportInfo = null;

    if (coords) {
        const dist = calculateDistance(coords[0], coords[1], GVA_COORDS.lat, GVA_COORDS.lon);
        // < 20km = 10, < 50km = 8, < 100km = 6, > 100km = 4
        if (dist < 20) airportScore = 10;
        else if (dist < 50) airportScore = 8;
        else if (dist < 100) airportScore = 6;
        else airportScore = 5;

        // Calculate detailed transport info
        const nearest = getNearestAirport(coords[0], coords[1]);
        if (nearest.airport) {
            transportInfo = estimateTravelTime(nearest.distance, nearest.airport);
            transportInfo.airportName = nearest.airport.code;
        }

    } else {
        airportScore = 5; // Default if no coords
    }
    
    return {
        job: jobChance,
        location: locationRating,
        airport: airportScore,
        barcelona: airportScore, // Correlated with airport access
        transport: transportInfo
    };
}

function initHospitalData(data) {
    const hospitalList = document.getElementById('hospital-list');
    hospitalList.innerHTML = '';

    // Render Airports
    if (typeof AIRPORT_DATA !== 'undefined') {
        AIRPORT_DATA.forEach(airport => {
            const marker = L.marker([airport.lat, airport.lon], { icon: airportIcon });
            
            const popupContent = `
                <div class="popup-content" style="min-width: 250px;">
                    <div class="popup-title">✈️ ${airport.name}</div>
                    <div class="popup-subtitle">Vols vers Barcelone (BCN)</div>
                    <div class="popup-text">
                        <strong>Durée vol:</strong> ${airport.flightsToBarcelona.duration}<br>
                        <strong>Fréquence:</strong> ${airport.flightsToBarcelona.frequency}<br>
                        <strong>Compagnies:</strong> ${airport.flightsToBarcelona.airlines.join(', ')}<br>
                        <strong>Prix moyen:</strong> ${airport.flightsToBarcelona.avgPrice}
                    </div>
                    <a href="${airport.website}" target="_blank" class="ai-action-btn" style="text-decoration: none; margin-top: 8px; font-size: 0.9em;">
                        <i class="fas fa-external-link-alt"></i> Voir sur Google Flights
                    </a>
                </div>
            `;
            marker.bindPopup(popupContent);
            airportLayer.addLayer(marker);
        });
    }

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
            
            // Calculate Ratings based on the first site (main site usually)
            const mainSite = hospital.sites[0];
            const ratings = getRatings(hospital, mainSite.adresse);

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
            
            let transportHtml = '';
            if (ratings.transport) {
                transportHtml = `
                    <div style="margin-top: 10px; padding: 8px; background-color: #f0f9ff; border-radius: 6px; font-size: 0.85em; border-left: 3px solid #3b82f6;">
                        <i class="fas fa-plane-departure" style="color: #3b82f6;"></i> 
                        Via <strong>${ratings.transport.airportName}</strong> à BCN: <br>
                        <span style="font-weight: 600; font-size: 1.1em;">~${ratings.transport.totalHours}h</span> total 
                        <span style="color: #64748b;">(dont ${ratings.transport.flightTime} vol)</span>
                    </div>
                `;
            }

            // Contact Button Logic
            let contactBtnHtml = '';
            if (hospital.chef_service || hospital.email_contact) {
                 const emailAction = hospital.email_contact ? `mailto:${hospital.email_contact}` : `https://www.google.com/search?q=Chef de service médecine interne ${hospital.nom} contact`;
                 const btnText = hospital.email_contact ? "Email Chef de Service" : "Chercher Contact";
                 
                 let chefInfo = '';
                 if (hospital.chef_service) {
                     chefInfo = `<div style="font-size: 0.8em; color: #64748b; margin-bottom: 4px;"><strong>Chef:</strong> ${hospital.chef_service}</div>`;
                 }

                 contactBtnHtml = `
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        ${chefInfo}
                        <a href="${emailAction}" target="_blank" class="ai-action-btn" style="text-decoration: none; color: var(--primary-color); text-align: center;">
                            <i class="fas fa-envelope"></i> ${btnText}
                        </a>
                    </div>
                 `;
            } else {
                contactBtnHtml = `
                    <a href="https://www.google.com/search?q=Chef de service médecine interne ${hospital.nom} contact email" target="_blank" class="ai-action-btn" style="flex: 1; text-decoration: none; color: var(--primary-color);">
                        <i class="fas fa-search"></i> Contact
                    </a>
                `;
            }

            card.innerHTML = `
                <div class="card-content">
                    <h4>
                        ${hospital.nom}
                        <span class="card-arrow">→</span>
                    </h4>
                    <p class="card-description">${hospital.description}</p>
                    <div class="sites-container">${sitesHtml}</div>
                    
                    ${transportHtml}

                    <div class="ratings-container">
                        <div class="rating-item">
                            <span class="rating-label">Chances de poste</span>
                            <span class="rating-value">${ratings.job}/10</span>
                        </div>
                        <div class="rating-bar"><div class="rating-fill" style="width: ${ratings.job * 10}%"></div></div>

                        <div class="rating-item">
                            <span class="rating-label">Qualité de vie</span>
                            <span class="rating-value">${ratings.location}/10</span>
                        </div>
                        <div class="rating-bar"><div class="rating-fill" style="width: ${ratings.location * 10}%"></div></div>

                        <div class="rating-item">
                            <span class="rating-label">Liens Barcelone/Aéroport</span>
                            <span class="rating-value">${ratings.barcelona}/10</span>
                        </div>
                        <div class="rating-bar"><div class="rating-fill" style="width: ${ratings.barcelona * 10}%"></div></div>
                    </div>

                    <div style="display: flex; gap: 5px; align-items: flex-end;">
                        <button class="ai-action-btn" style="flex: 1;" onclick="openCoverLetterModal('${hospital.nom.replace(/'/g, "\\'")}')">
                            <i class="fas fa-file-alt"></i> Lettre IA
                        </button>
                        ${contactBtnHtml}
                    </div>
                </div>
            `;
            
            // Interaction: Card Click
            card.onclick = (e) => {
                if (e.target.closest('button')) return; // Don't trigger map zoom if button clicked
                if (e.target.closest('a')) return;

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
                const siteCoords = ADDRESS_COORDINATES[site.adresse];
                
                if (siteCoords) {
                    const marker = L.marker(siteCoords);
                    
                    const popupContent = `
                        <div class="popup-content">
                            <div class="popup-title">${hospital.nom}</div>
                            <div class="popup-subtitle">${site.ville}</div>
                            <div class="popup-text">${site.adresse}</div>
                            <div style="margin-top:5px; font-size: 0.8em; color: green;">
                                <i class="fas fa-plane"></i> Score Aéroport: ${ratings.airport}/10
                            </div>
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                    
                    marker.on('click', () => {
                        const targetCard = document.getElementById(`card-${hospitalId}`);
                        if (targetCard) {
                            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            document.querySelectorAll('.hospital-card').forEach(c => c.classList.remove('active'));
                            targetCard.classList.add('active');
                        }
                    });

                    clusterGroup.addLayer(marker);
                    
                    if (siteIndex === 0) {
                        sidebarMarkers[hospitalId] = marker;
                    }
                }
            });
        });
    });
}

// Modal Logic
const modal = document.getElementById("cover-letter-modal");
const span = document.getElementsByClassName("close-modal")[0];
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");

if (span) {
    span.onclick = function() {
      modal.style.display = "none";
    }
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

window.openCoverLetterModal = function(hospitalName) {
    document.getElementById("modal-hospital-name").innerText = hospitalName;
    modal.style.display = "block";
    document.getElementById("generation-result").style.display = "none";
}

// AI Generation Logic
if (generateBtn) {
    // Load saved API key
    const savedKey = localStorage.getItem("ai_api_key");
    if (savedKey) {
        document.getElementById("api-key").value = savedKey;
    }

    generateBtn.onclick = async function() {
        const apiKey = document.getElementById("api-key").value;
        localStorage.setItem("ai_api_key", apiKey); // Save key
        
        const userName = document.getElementById("user-name").value;
        const userDetails = document.getElementById("user-details").value;
        const hospitalName = document.getElementById("modal-hospital-name").innerText;
        const model = document.getElementById("model-select").value;
        const resultArea = document.getElementById("generation-result");
        const finalLetter = document.getElementById("final-letter");

        if (!apiKey) {
            alert("Veuillez entrer une clé API.");
            return;
        }

        generateBtn.innerText = "Génération en cours...";
        generateBtn.disabled = true;

        const prompt = `
            Écris une lettre de motivation professionnelle pour un poste de Médecin Assistant en Médecine Interne à l'hôpital ${hospitalName} en Suisse.
            
            Candidat: ${userName}
            Détails/Expérience: ${userDetails}
            
            La lettre doit être formelle, structureée, et mentionner l'intérêt pour cet hôpital spécifique (qui est réputé, public/privé selon le nom).
            Mentionne aussi l'intérêt pour la formation.
            Langue: Français.
        `;

        try {
            let generatedText = "";

            if (model.includes("gpt")) {
                // OpenAI
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
                        temperature: 0.7
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                
                // Handle different response structures if needed, but usually choices[0].message.content
                if (data.choices && data.choices.length > 0) {
                     generatedText = data.choices[0].message.content;
                } else {
                    throw new Error("Réponse inattendue de l'API OpenAI");
                }

            } else {
                // Gemini
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                    generatedText = data.candidates[0].content.parts[0].text;
                } else {
                     throw new Error("Réponse inattendue de l'API Gemini (Bloqué ?)");
                }
            }

            finalLetter.value = generatedText;
            resultArea.style.display = "block";

        } catch (error) {
            alert("Erreur: " + error.message);
            console.error(error);
        } finally {
            generateBtn.innerText = "Générer la Lettre";
            generateBtn.disabled = false;
        }
    };
}

if (copyBtn) {
    copyBtn.onclick = function() {
        const copyText = document.getElementById("final-letter");
        copyText.select();
        document.execCommand("copy");
        alert("Copié !");
    };
}

// Tab Switching Logic
window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const lists = document.querySelectorAll('.list-content');
    
    // Update Tabs
    tabs.forEach(tab => {
        if (tab.innerText.toLowerCase().includes(tabName === 'hospitals' ? 'hôpitaux' : 'aéroports')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update Content
    if (tabName === 'hospitals') {
        document.getElementById('hospital-list').style.display = 'block';
        document.getElementById('airport-list').style.display = 'none';
        
        // Fit bounds to all markers (hospitals)
        if (hospitalLayer && map) {
             // Logic to fit bounds if needed, or just let user explore
        }
    } else {
        document.getElementById('hospital-list').style.display = 'none';
        document.getElementById('airport-list').style.display = 'block';
    }
}

function initAirportData() {
    const airportList = document.getElementById('airport-list');
    airportList.innerHTML = '';

    if (typeof AIRPORT_DATA !== 'undefined') {
        AIRPORT_DATA.forEach(airport => {
            const card = document.createElement('div');
            card.className = 'airport-card';
            
            // Visual flight duration bar logic
            const durationParts = airport.flightsToBarcelona.duration.match(/(\d+)h\s*(\d+)?/);
            // Just for visual effect in this demo
            
            card.innerHTML = `
                <div class="airport-header">
                    <span class="airport-name">${airport.name}</span>
                    <span class="airport-code">${airport.code}</span>
                </div>
                <div class="airport-body">
                    <div class="flight-route">
                        <div class="route-point">
                            ${airport.code}
                            <span>Suisse</span>
                        </div>
                        <div class="flight-line"></div>
                        <div class="route-point">
                            BCN
                            <span>Barcelone</span>
                        </div>
                    </div>
                    
                    <div class="flight-stats">
                        <div class="stat-item">
                            <span class="stat-value">${airport.flightsToBarcelona.duration}</span>
                            <span class="stat-label">Durée Moyenne</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${airport.flightsToBarcelona.avgPrice}</span>
                            <span class="stat-label">Prix Est.</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <span class="stat-label">Compagnies</span>
                        <div class="airline-badges">
                            ${airport.flightsToBarcelona.airlines.map(airline => `<span class="airline-badge">✈ ${airline}</span>`).join('')}
                        </div>
                    </div>

                    <a href="${airport.website}" target="_blank" class="airport-action-btn">
                        <i class="fas fa-ticket-alt"></i> Voir les Vols & Horaires
                    </a>
                </div>
            `;
            
            // Interaction: Zoom to airport on click
            card.onclick = (e) => {
                if (e.target.closest('a')) return;
                
                map.flyTo([airport.lat, airport.lon], 13, { duration: 1.5 });
                
                // Open popup of the corresponding marker
                airportLayer.eachLayer(layer => {
                     // Approximate matching logic or store ID references
                     const latLng = layer.getLatLng();
                     if (Math.abs(latLng.lat - airport.lat) < 0.001) {
                         layer.openPopup();
                     }
                });
            };

            airportList.appendChild(card);
        });
    }
}

// Initialize
if (typeof HOSPITAL_DATA !== 'undefined') {
    initHospitalData(HOSPITAL_DATA);
}

if (typeof AIRPORT_DATA !== 'undefined') {
    initAirportData();
}
