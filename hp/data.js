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
          "description": "Très réputé pour la formation de base."
        },
        {
          "nom": "EHC (Ensemble Hospitalier de la Côte)",
          "sites": [
            {"ville": "Morges", "adresse": "Chemin du Crêt 2, 1110 Morges, Suisse"}
          ],
          "description": "Très prisé en raison de sa proximité avec Lausanne et Genève."
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
          "description": "Pour de nombreuses spécialités, Sion fonctionne presque comme un 'petit A'."
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
          "description": "Établissements de catégorie B très complets pour la plupart des spécialités."
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
          "description": "Réseau principal du canton du Jura."
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
    "Rue d'Entremonts 11, 1400 Yverdon-les-Bains, Suisse": [46.77255, 6.64328],
    "Hôpital de Saint-Loup, 1318 Pompaples, Suisse": [46.66683, 6.50529],
    "Chemin du Crêt 2, 1110 Morges, Suisse": [46.51602, 6.49381],
    "Route du Vieux Séquoia 20, 1847 Rennaz, Suisse": [46.38071, 6.92552],
    "Avenue de la Prairie 3, 1800 Vevey, Suisse": [46.46745, 6.84078],
    "Route de Choëx 21, 1870 Monthey, Suisse": [46.24864, 6.94521],
    "Avenue de la Folie 8, 1530 Payerne, Suisse": [46.82173, 6.93796],
    "Avenue du Grand-Champsec 80, 1950 Sion, Suisse": [46.22461, 7.38372],
    "Rue Saint-Charles 14, 3960 Sierre, Suisse": [46.29362, 7.53623],
    "Avenue de la Fusion 27, 1920 Martigny, Suisse": [46.10425, 7.07041],
    "Chemin des Pensionnats 2-6, 1708 Fribourg, Suisse": [46.80454, 7.14352],
    "Rue de l'Hôpital 9, 1632 Riaz, Suisse": [46.64161, 7.06012],
    "Maggenberg 1, 1712 Tafers, Suisse": [46.81602, 7.21603],
    "Rue de la Maladière 45, 2000 Neuchâtel, Suisse": [46.99751, 6.94553],
    "Rue de Chasseral 20, 2300 La Chaux-de-Fonds, Suisse": [47.09842, 6.82021],
    "Faubourg des Capucins 30, 2800 Delémont, Suisse": [47.36151, 7.34782],
    "Chemin de l'Hôpital 9, 2900 Porrentruy, Suisse": [47.41952, 7.07553],
    "Beausite 49, 2740 Moutier, Suisse": [47.28001, 7.37302],
    "Les Fontenayes 17, 2610 Saint-Imier, Suisse": [47.16552, 7.00451],
    "Avenue J.-D.-Maillard 3, 1217 Meyrin, Suisse": [46.22890962097334, 6.0675822547779505],
    "Chemin de Beau-Soleil 20, 1206 Genève, Suisse": [46.18851, 6.16152],
    "Chemin des Grangettes 7, 1224 Chêne-Bougeries, Suisse": [46.19824, 6.18551]
};
