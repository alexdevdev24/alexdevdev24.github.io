const https = require('https');

/**
 * Utility script to fetch coordinates (latitude, longitude) for hospital addresses
 * uses the Nominatim API (OpenStreetMap).
 * 
 * Usage: node geocode.js
 */

const HOSPITAL_DATA = {
  "suisse_francophone": [
    {
      "canton": "Vaud",
      "hopitaux": [
        {
          "nom": "eHnv (Établissements Hospitaliers du Nord Vaudois)",
          "sites": [
            {"ville": "Yverdon-les-Bains", "adresse": "Rue d'Entremonts 11, 1400 Yverdon-les-Bains, Suisse"},
            {"ville": "Saint-Loup", "adresse": "Hôpital de Saint-Loup, 1318 Pompaples, Suisse"}
          ]
        },
        {
          "nom": "EHC (Ensemble Hospitalier de la Côte)",
          "sites": [
            {"ville": "Morges", "adresse": "Chemin du Crêt 2, 1110 Morges, Suisse"}
          ]
        },
        {
          "nom": "HRC (Hôpital Riviera-Chablais)",
          "sites": [
            {"ville": "Rennaz", "adresse": "Route du Vieux Séquoia 20, 1847 Rennaz, Suisse"},
            {"ville": "Vevey", "adresse": "Avenue de la Prairie 3, 1800 Vevey, Suisse"},
            {"ville": "Monthey", "adresse": "Route de Choëx 21, 1870 Monthey, Suisse"}
          ]
        },
        {
          "nom": "HIB (Hôpital Intercantonal de la Broye)",
          "sites": [
            {"ville": "Payerne", "adresse": "Avenue de la Folie 8, 1530 Payerne, Suisse"}
          ]
        }
      ]
    },
    {
      "canton": "Valais",
      "hopitaux": [
        {
          "nom": "Hôpital du Valais (CHVR)",
          "sites": [
            {"ville": "Sion", "adresse": "Avenue du Grand-Champsec 80, 1950 Sion, Suisse"},
            {"ville": "Sierre", "adresse": "Rue Saint-Charles 14, 3960 Sierre, Suisse"},
            {"ville": "Martigny", "adresse": "Avenue de la Fusion 27, 1920 Martigny, Suisse"}
          ]
        }
      ]
    },
    {
      "canton": "Fribourg",
      "hopitaux": [
        {
          "nom": "HFR (Hôpital fribourgeois)",
          "sites": [
            {"ville": "Fribourg", "adresse": "Chemin des Pensionnats 2-6, 1708 Fribourg, Suisse"},
            {"ville": "Riaz", "adresse": "Rue de l'Hôpital 9, 1632 Riaz, Suisse"},
            {"ville": "Tavel", "adresse": "Maggenberg 1, 1712 Tafers, Suisse"}
          ]
        }
      ]
    },
    {
      "canton": "Neuchâtel",
      "hopitaux": [
        {
          "nom": "RHNe (Réseau Hospitalier Neuchâtelois)",
          "sites": [
            {"ville": "Neuchâtel (Pourtalès)", "adresse": "Rue de la Maladière 45, 2000 Neuchâtel, Suisse"},
            {"ville": "La Chaux-de-Fonds", "adresse": "Rue de Chasseral 20, 2300 La Chaux-de-Fonds, Suisse"}
          ]
        }
      ]
    },
    {
      "canton": "Jura & Jura Bernois",
      "hopitaux": [
        {
          "nom": "H-JU (Hôpital du Jura)",
          "sites": [
            {"ville": "Delémont", "adresse": "Faubourg des Capucins 30, 2800 Delémont, Suisse"},
            {"ville": "Porrentruy", "adresse": "Chemin de l'Hôpital 9, 2900 Porrentruy, Suisse"}
          ]
        },
        {
          "nom": "Hôpital du Jura Bernois",
          "sites": [
            {"ville": "Moutier", "adresse": "Beausite 49, 2740 Moutier, Suisse"},
            {"ville": "Saint-Imier", "adresse": "Les Fontenayes 17, 2610 Saint-Imier, Suisse"}
          ]
        }
      ]
    },
    {
      "canton": "Genève",
      "hopitaux": [
        {
          "nom": "Hôpital de La Tour",
          "sites": [
            {"ville": "Meyrin", "adresse": "Avenue J.-D.-Maillard 3, 1217 Meyrin, Suisse"}
          ]
        },
        {
          "nom": "Générale-Beaulieu et Grangettes",
          "sites": [
            {"ville": "Genève", "adresse": "Chemin de Beau-Soleil 20, 1206 Genève, Suisse"},
            {"ville": "Chêne-Bougeries", "adresse": "Chemin des Grangettes 7, 1224 Chêne-Bougeries, Suisse"}
          ]
        }
      ]
    }
  ]
};

const addresses = [];

// Extract unique addresses
HOSPITAL_DATA.suisse_francophone.forEach(c => {
    c.hopitaux.forEach(h => {
        h.sites.forEach(s => {
            addresses.push(s.adresse);
        });
    });
});

async function fetchCoordinates(address) {
    return new Promise((resolve) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        
        const options = {
            headers: {
                'User-Agent': 'HospitalLocator-UpdateScript/1.0' 
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.length > 0) {
                        resolve([parseFloat(json[0].lat), parseFloat(json[0].lon)]);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (e) => {
            resolve(null);
        });
    });
}

async function processAll() {
    console.log(`🔍 Mise à jour des coordonnées pour ${addresses.length} adresses...`);
    
    const results = {};
    
    for (const address of addresses) {
        // Sleep to respect Nominatim usage policy (1/sec)
        await new Promise(r => setTimeout(r, 1100));
        const coords = await fetchCoordinates(address);
        if (coords) {
            console.log(`✅ ${address}`);
            results[address] = coords;
        } else {
            console.log(`❌ ${address} (Non trouvé)`);
        }
    }
    
    console.log("\n🚀 Terminé ! Copiez cet objet dans ADDRESS_COORDINATES dans data.js :\n");
    console.log(JSON.stringify(results, null, 4));
}

processAll();
