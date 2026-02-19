const HOSPITAL_DATA = {
  "suisse_francophone": [
    {
      "canton": "Vaud",
      "description": "Très dense en hôpitaux périphériques. L'un des plus grands pourvoyeurs de postes hors centre universitaire.",
      "hopitaux": [
        {
          "nom": "eHnv (Établissements Hospitaliers du Nord Vaudois)",
          "sites": [
            {"ville": "Yverdon-les-Bains", "adresse": "Rue d'Entremonts 11, 1400 Yverdon-les-Bains, Suisse"},
            {"ville": "Saint-Loup", "adresse": "Hôpital de Saint-Loup, 1318 Pompaples, Suisse"}
          ],
          "description": "Très réputé pour la formation de base.",
          "chef_service": "Dr. Jean-Christophe Laurent",
          "email_contact": "jean-christophe.laurent@ehnv.ch"
        },
        {
          "nom": "EHC (Ensemble Hospitalier de la Côte)",
          "sites": [
            {"ville": "Morges", "adresse": "Chemin du Crêt 2, 1110 Morges, Suisse"}
          ],
          "description": "Très prisé en raison de sa proximité avec Lausanne et Genève.",
          "chef_service": "Prof. Oscar Marchetti",
          "email_contact": "secretariat.departement.medecine@ehc.vd.ch"
        },
        {
          "nom": "HRC (Hôpital Riviera-Chablais)",
          "sites": [
            {"ville": "Rennaz", "adresse": "Route du Vieux Séquoia 20, 1847 Rennaz, Suisse"},
            {"ville": "Vevey", "adresse": "Avenue de la Prairie 3, 1800 Vevey, Suisse"},
            {"ville": "Monthey", "adresse": "Route de Choëx 21, 1870 Monthey, Suisse"}
          ],
          "description": "Un grand hôpital intercantonal flambant neuf."
        },
        {
          "nom": "HIB (Hôpital Intercantonal de la Broye)",
          "sites": [
            {"ville": "Payerne", "adresse": "Avenue de la Folie 8, 1530 Payerne, Suisse"}
          ],
          "description": "Excellente pour un encadrement de proximité."
        }
      ]
    },
    {
      "canton": "Valais",
      "description": "La partie francophone recrute énormément de médecins formés à l'étranger.",
      "hopitaux": [
        {
          "nom": "Hôpital du Valais (CHVR)",
          "sites": [
            {"ville": "Sion", "adresse": "Avenue du Grand-Champsec 80, 1950 Sion, Suisse"},
            {"ville": "Sierre", "adresse": "Rue Saint-Charles 14, 3960 Sierre, Suisse"},
            {"ville": "Martigny", "adresse": "Avenue de la Fusion 27, 1920 Martigny, Suisse"}
          ],
          "description": "Pour de nombreuses spécialités, Sion fonctionne presque comme un 'petit A'.",
          "chef_service": "Prof. Pierre-Auguste Petignat",
          "email_contact": "p-a.petignat@hopitalvs.ch"
        }
      ]
    },
    {
      "canton": "Fribourg",
      "description": "Canton bilingue, sites principaux francophones ou bilingues.",
      "hopitaux": [
        {
          "nom": "HFR (Hôpital fribourgeois)",
          "sites": [
            {"ville": "Fribourg", "adresse": "Chemin des Pensionnats 2-6, 1708 Fribourg, Suisse"},
            {"ville": "Riaz", "adresse": "Rue de l'Hôpital 9, 1632 Riaz, Suisse"},
            {"ville": "Tavel", "adresse": "Maggenberg 1, 1712 Tafers, Suisse"}
          ],
          "description": "Gros pôle de catégorie B avec des périphériques pour la médecine interne de base."
        }
      ]
    },
    {
      "canton": "Neuchâtel",
      "description": "Établissements très complets.",
      "hopitaux": [
        {
          "nom": "RHNe (Réseau Hospitalier Neuchâtelois)",
          "sites": [
            {"ville": "Neuchâtel (Pourtalès)", "adresse": "Rue de la Maladière 45, 2000 Neuchâtel, Suisse"},
            {"ville": "La Chaux-de-Fonds", "adresse": "Rue de Chasseral 20, 2300 La Chaux-de-Fonds, Suisse"}
          ],
          "description": "Établissements de catégorie B très complets pour la plupart des spécialités.",
          "chef_service": "Prof. Jacques Donzé",
          "email_contact": "secretariat.dmi@rhne.ch"
        }
      ]
    },
    {
      "canton": "Jura & Jura Bernois",
      "description": "Idéal pour trouver un premier poste plus facilement.",
      "hopitaux": [
        {
          "nom": "H-JU (Hôpital du Jura)",
          "sites": [
            {"ville": "Delémont", "adresse": "Faubourg des Capucins 30, 2800 Delémont, Suisse"},
            {"ville": "Porrentruy", "adresse": "Chemin de l'Hôpital 9, 2900 Porrentruy, Suisse"}
          ],
          "description": "Réseau principal du canton du Jura.",
          "chef_service": "Dr. Hervé Duplain",
          "email_contact": "Herve.Duplain@h-ju.ch"
        },
        {
          "nom": "Hôpital du Jura Bernois",
          "sites": [
            {"ville": "Moutier", "adresse": "Beausite 49, 2740 Moutier, Suisse"},
            {"ville": "Saint-Imier", "adresse": "Les Fontenayes 17, 2610 Saint-Imier, Suisse"}
          ],
          "description": "Situé dans la partie francophone du canton de Berne."
        }
      ]
    },
    {
      "canton": "Genève",
      "description": "Les postes B et C se trouvent principalement dans le privé ou parapublic.",
      "hopitaux": [
        {
          "nom": "Hôpital de La Tour",
          "sites": [
            {"ville": "Meyrin", "adresse": "Avenue J.-D.-Maillard 3, 1217 Meyrin, Suisse"}
          ],
          "description": "Le plus grand hôpital privé de Genève avec urgences et soins intensifs."
        },
        {
          "nom": "Générale-Beaulieu et Grangettes",
          "sites": [
            {"ville": "Genève", "adresse": "Chemin de Beau-Soleil 20, 1206 Genève, Suisse"},
            {"ville": "Chêne-Bougeries", "adresse": "Chemin des Grangettes 7, 1224 Chêne-Bougeries, Suisse"}
          ],
          "description": "Établissements privés reconnus pour certaines spécialités."
        }
      ]
    }
  ]
};

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


const AIRPORT_DATA = [
    {
        name: "Aéroport de Genève (GVA)",
        code: "GVA",
        lat: 46.2304,
        lon: 6.1102,
        website: "https://www.google.com/travel/flights?q=Flights+from+GVA+to+BCN",
        flightsToBarcelona: {
            airlines: ["EasyJet", "Vueling", "Swiss"],
            duration: "1h 35min",
            frequency: "Tous les jours (min. 3 vols/jour)",
            avgPrice: "50-150 CHF"
        },
        transport: {
            type: "Train",
            description: "Gare CFF directement dans l'aéroport (Genève-Aéroport)."
        }
    },
    {
        name: "Aéroport de Bâle-Mulhouse (BSL)",
        code: "BSL",
        lat: 47.5900,
        lon: 7.5290,
        website: "https://www.google.com/travel/flights?q=Flights+from+BSL+to+BCN",
        flightsToBarcelona: {
            airlines: ["EasyJet", "Vueling"],
            duration: "1h 40min",
            frequency: "Tous les jours (min. 2 vols/jour)",
            avgPrice: "40-120 CHF"
        },
        transport: {
            type: "Bus/Train",
            description: "Bus depuis la gare de Bâle CFF (15 min)."
        }
    },
    {
        name: "Aéroport de Zurich (ZRH)",
        code: "ZRH",
        lat: 47.4647,
        lon: 8.5492,
        website: "https://www.google.com/travel/flights?q=Flights+from+ZRH+to+BCN",
        flightsToBarcelona: {
            airlines: ["Swiss", "Vueling", "Iberia"],
            duration: "1h 50min",
            frequency: "Tous les jours (min. 5 vols/jour)",
            avgPrice: "80-200 CHF"
        },
        transport: {
            type: "Train",
            description: "Gare CFF majeure sous l'aéroport."
        }
    }
];
