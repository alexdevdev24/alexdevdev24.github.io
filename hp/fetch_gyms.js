const https = require('https');
const fs = require('fs');

// We'll use the coordinates from data.js
const ADDRESS_COORDINATES = {
    "Rue d'Entremonts 11, 1400 Yverdon-les-Bains, Suisse": [46.771358, 6.646303],
    "Hôpital de Saint-Loup, 1318 Pompaples, Suisse": [46.6667664, 6.5028215],
    "Chemin du Crêt 2, 1110 Morges, Suisse": [46.522671, 6.4999625],
    "Route du Vieux Séquoia 20, 1847 Rennaz, Suisse": [46.3797139, 6.9209109],
    "Avenue de la Prairie 3, 1800 Vevey, Suisse": [46.4578925, 6.8548598],
    "Route de Choëx 21, 1870 Monthey, Suisse": [46.2471839, 6.9511784],
    "Avenue de la Folie 8, 1530 Payerne, Suisse": [46.82173, 6.93796],
    "Avenue du Grand-Champsec 80, 1950 Sion, Suisse": [46.2354076, 7.3871377],
    "Rue Saint-Charles 14, 3960 Sierre, Suisse": [46.2920809, 7.5215546],
    "Avenue de la Fusion 27, 1920 Martigny, Suisse": [46.0995499, 7.0683591],
    "Chemin des Pensionnats 2-6, 1708 Fribourg, Suisse": [46.8019175, 7.1379484],
    "Rue de l'Hôpital 9, 1632 Riaz, Suisse": [46.6412847, 7.0602063],
    "Maggenberg 1, 1712 Tafers, Suisse": [46.8101964, 7.2120193],
    "Rue de la Maladière 45, 2000 Neuchâtel, Suisse": [46.995826, 6.9421519],
    "Rue de Chasseral 20, 2300 La Chaux-de-Fonds, Suisse": [47.1136975, 6.8329747],
    "Faubourg des Capucins 30, 2800 Delémont, Suisse": [47.3685854, 7.3384352],
    "Chemin de l'Hôpital 9, 2900 Porrentruy, Suisse": [47.4193445, 7.057923],
    "Beausite 49, 2740 Moutier, Suisse": [47.2820624, 7.3743433],
    "Les Fontenayes 17, 2610 Saint-Imier, Suisse": [47.1484654, 6.9839743],
    "Avenue J.-D.-Maillard 3, 1217 Meyrin, Suisse": [46.22890962097334, 6.0675822547779505],
    "Chemin de Beau-Soleil 20, 1206 Genève, Suisse": [46.1884814, 6.1617309],
    "Chemin des Grangettes 7, 1224 Chêne-Bougeries, Suisse": [46.1998578, 6.1819624]
};

async function fetchGymsNear(lat, lon, radius = 2000) {
    const query = `[out:json];
    (
      node["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      way["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      node["leisure"="sports_centre"]["sport"~"fitness"](around:${radius},${lat},${lon});
    );
    out body center;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const gyms = json.elements.map(el => ({
                        name: el.tags.name || "Salle de sport",
                        lat: el.lat || (el.center ? el.center.lat : null),
                        lon: el.lon || (el.center ? el.center.lon : null)
                    })).filter(g => g.lat && g.lon);
                    resolve(gyms);
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', (e) => resolve([]));
    });
}

async function run() {
    console.log("Fetching gyms near hospitals...");
    const gymResults = {};

    for (const [address, coords] of Object.entries(ADDRESS_COORDINATES)) {
        console.log(`Checking near: ${address}`);
        const gyms = await fetchGymsNear(coords[0], coords[1]);
        console.log(`Found ${gyms.length} gyms.`);
        
        gyms.forEach(gym => {
            const key = `${gym.lat},${gym.lon}`;
            if (!gymResults[key]) {
                gymResults[key] = {
                    name: gym.name,
                    lat: gym.lat,
                    lon: gym.lon
                };
            }
        });
        
        // Respect API rate limits
        await new Promise(r => setTimeout(r, 2000));
    }

    const finalGyms = Object.values(gymResults);
    console.log(`Total unique gyms found: ${finalGyms.length}`);
    
    fs.writeFileSync('gyms.json', JSON.stringify(finalGyms, null, 4));
    console.log("Saved to gyms.json");
}

run();
