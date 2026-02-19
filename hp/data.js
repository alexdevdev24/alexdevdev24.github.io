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

const GYM_DATA = [
    {
        "name": "Urakan Crossfit",
        "lat": 46.792048,
        "lon": 6.6218204
    },
    {
        "name": "Let's Go Yverdon",
        "lat": 46.7811894,
        "lon": 6.6451609
    },
    {
        "name": "Crossfit Urakan",
        "lat": 46.7917346,
        "lon": 6.6216617
    },
    {
        "name": "VO2 Sport",
        "lat": 46.7794472,
        "lon": 6.6249359
    },
    {
        "name": "Blue Fit",
        "lat": 46.7905836,
        "lon": 6.6214129
    },
    {
        "name": "Arcades Fitness",
        "lat": 46.7816788,
        "lon": 6.636137
    },
    {
        "name": "Osci fit",
        "lat": 46.7838167,
        "lon": 6.6335165
    },
    {
        "name": "Fight Club Champions Boxing",
        "lat": 46.7845813,
        "lon": 6.6259283
    },
    {
        "name": "Centre Sportif Régional de Borné-Nau",
        "lat": 46.8146197,
        "lon": 6.6486407
    },
    {
        "name": "Fitness Let's Go Villeneuve",
        "lat": 46.3852307,
        "lon": 6.9312153
    },
    {
        "name": "Mov'it Fitness",
        "lat": 46.4235928,
        "lon": 6.9254653
    },
    {
        "name": "Activ Fitness",
        "lat": 46.4649519,
        "lon": 6.8417018
    },
    {
        "name": "Let's Go Fitness",
        "lat": 46.4642061,
        "lon": 6.8390923
    },
    {
        "name": "Log 3 Fitness",
        "lat": 46.4598473,
        "lon": 6.846989
    },
    {
        "name": "Espace Le Lab",
        "lat": 46.4654546,
        "lon": 6.8421996
    },
    {
        "name": "Body Brain",
        "lat": 46.4585121,
        "lon": 6.8499147
    },
    {
        "name": "Terre d’Eveil",
        "lat": 46.4669651,
        "lon": 6.8443798
    },
    {
        "name": "Pilates25",
        "lat": 46.4683945,
        "lon": 6.8424508
    },
    {
        "name": "Terre du Yoga",
        "lat": 46.4669389,
        "lon": 6.8444427
    },
    {
        "name": "Iron Body Fit",
        "lat": 46.4604276,
        "lon": 6.8444042
    },
    {
        "name": "Salle de gymnastique de Bahyse II (ancienne)",
        "lat": 46.4667064,
        "lon": 6.8954625
    },
    {
        "name": "ActivFitness",
        "lat": 46.8041593,
        "lon": 7.1507496
    },
    {
        "name": "Ecole du Mouvement",
        "lat": 46.8007241,
        "lon": 7.15148
    },
    {
        "name": "Yogiface",
        "lat": 46.8006939,
        "lon": 7.1513229
    },
    {
        "name": "Seisler Fit",
        "lat": 46.8221151,
        "lon": 7.2094661
    },
    {
        "name": "Physic Club",
        "lat": 47.0877784,
        "lon": 6.8048632
    },
    {
        "name": "Let's Go Fitness",
        "lat": 47.0979498,
        "lon": 6.8222695
    },
    {
        "name": "Tosal Gym",
        "lat": 47.105949,
        "lon": 6.8247921
    },
    {
        "name": "Evolution",
        "lat": 47.1061455,
        "lon": 6.8373478
    },
    {
        "name": "DiscountFit",
        "lat": 47.0999028,
        "lon": 6.8275076
    },
    {
        "name": "Activ Fitness",
        "lat": 47.1007008,
        "lon": 6.8259088
    },
    {
        "name": "Espace Equilibre",
        "lat": 47.1021298,
        "lon": 6.8300392
    },
    {
        "name": "Sports Training Center",
        "lat": 47.0955935,
        "lon": 6.8168029
    },
    {
        "name": "Raja Yoga",
        "lat": 47.1013723,
        "lon": 6.8223866
    },
    {
        "name": "Judo-Karaté Club",
        "lat": 47.090547,
        "lon": 6.8062961
    },
    {
        "name": "Street workout",
        "lat": 47.0914932,
        "lon": 6.8071233
    },
    {
        "name": "Manawa",
        "lat": 47.0935356,
        "lon": 6.8180562
    },
    {
        "name": "FT45",
        "lat": 47.1016179,
        "lon": 6.8306446
    },
    {
        "name": "Pacific Fitness",
        "lat": 47.2720928,
        "lon": 7.3529175
    },
    {
        "name": "Halle de gymnastique",
        "lat": 47.2749911,
        "lon": 7.344519
    },
    {
        "name": "Place de sport",
        "lat": 47.1574461,
        "lon": 7.0190741
    },
    {
        "name": "Complexe communal",
        "lat": 47.1570817,
        "lon": 7.0191144
    },
    {
        "name": "NonStop Gym Pâquis",
        "lat": 46.2167065,
        "lon": 6.1480928
    },
    {
        "name": "Easyfit",
        "lat": 46.1982163,
        "lon": 6.241996
    },
    {
        "name": "12a",
        "lat": 46.2144176,
        "lon": 6.1484321
    },
    {
        "name": "Digital Fight Club Sports",
        "lat": 46.1970403,
        "lon": 6.144486
    },
    {
        "name": "Gym by Harmony",
        "lat": 46.2148762,
        "lon": 6.1468282
    },
    {
        "name": "Activ Fitness",
        "lat": 46.2115211,
        "lon": 6.1448341
    },
    {
        "name": "Coach Sportif - Marie Trapezaroff",
        "lat": 46.2041866,
        "lon": 6.1599555
    },
    {
        "name": "Arnbäck Training",
        "lat": 46.2006481,
        "lon": 6.1573169
    },
    {
        "name": "Fitwork",
        "lat": 46.2132666,
        "lon": 6.1257279
    },
    {
        "name": "Activ Fitness",
        "lat": 46.1873324,
        "lon": 6.1271329
    },
    {
        "name": "Non-Stop Gym",
        "lat": 46.1934942,
        "lon": 6.1655859
    },
    {
        "name": "NonStop Gym Jonction",
        "lat": 46.2016046,
        "lon": 6.1302496
    },
    {
        "name": "BenfitCoach",
        "lat": 46.1961408,
        "lon": 6.2322253
    },
    {
        "name": "Pratibha",
        "lat": 46.2110474,
        "lon": 6.1398539
    },
    {
        "name": "À fleur de peau",
        "lat": 46.2113828,
        "lon": 6.1408933
    },
    {
        "name": "Basic-Fit",
        "lat": 46.1963878,
        "lon": 6.2370358
    },
    {
        "name": "Gravity Functional",
        "lat": 46.1936179,
        "lon": 6.1293777
    },
    {
        "name": "Let's Go Fitness - Club de Champel",
        "lat": 46.1909088,
        "lon": 6.1549194
    },
    {
        "name": "Shanti Club",
        "lat": 46.2112984,
        "lon": 6.1386622
    },
    {
        "name": "Evo",
        "lat": 46.202284,
        "lon": 6.1692675
    },
    {
        "name": "Street workout",
        "lat": 46.2086104,
        "lon": 6.1646211
    },
    {
        "name": "Swiss Fit",
        "lat": 46.2114726,
        "lon": 6.1391612
    },
    {
        "name": "Activ fitness",
        "lat": 46.2155759,
        "lon": 6.1348639
    },
    {
        "name": "Non stop gym",
        "lat": 46.2154328,
        "lon": 6.1328665
    },
    {
        "name": "Studio Soham",
        "lat": 46.2115738,
        "lon": 6.1512611
    },
    {
        "name": "ashtanga passion club",
        "lat": 46.2122275,
        "lon": 6.1466313
    },
    {
        "name": "evo fitness",
        "lat": 46.2011861,
        "lon": 6.1328352
    },
    {
        "name": "Deva yoga",
        "lat": 46.1900091,
        "lon": 6.1342084
    },
    {
        "name": "Atelier Corps et Mouvement",
        "lat": 46.1899794,
        "lon": 6.1357598
    },
    {
        "name": "Inshape studio",
        "lat": 46.2034824,
        "lon": 6.1632804
    },
    {
        "name": "Akta yoga",
        "lat": 46.2047967,
        "lon": 6.1617717
    },
    {
        "name": "Non-Stop Gym",
        "lat": 46.2095815,
        "lon": 6.1414401
    },
    {
        "name": "Bodystudio",
        "lat": 46.24075,
        "lon": 6.1982717
    },
    {
        "name": "Non Stop Gym",
        "lat": 46.2164814,
        "lon": 6.1479365
    },
    {
        "name": "Urban Ride",
        "lat": 46.2121698,
        "lon": 6.1504861
    },
    {
        "name": "Yoga Feldenkrais",
        "lat": 46.2130201,
        "lon": 6.1382806
    },
    {
        "name": "Studio GVA",
        "lat": 46.2127255,
        "lon": 6.1483622
    },
    {
        "name": "Wellness Sport Club",
        "lat": 46.213902,
        "lon": 6.1501352
    },
    {
        "name": "Michelle",
        "lat": 46.2105934,
        "lon": 6.1398008
    },
    {
        "name": "Bâtiment des Charmettes",
        "lat": 46.1847848,
        "lon": 6.1384678
    },
    {
        "name": "Centre sportif de la Queue-d'Arve",
        "lat": 46.1962968,
        "lon": 6.1313242
    },
    {
        "name": "Gymnase Bellivier",
        "lat": 46.1856818,
        "lon": 6.2162619
    },
    {
        "name": "Gymnase Lucien Veyrat",
        "lat": 46.1961466,
        "lon": 6.2219143
    },
    {
        "name": "L'Appart Fitness",
        "lat": 46.1900275,
        "lon": 6.235449
    },
    {
        "name": "CrossFit Custom Annemasse",
        "lat": 46.1866867,
        "lon": 6.2365097
    },
    {
        "name": "Salle de sport",
        "lat": 46.1909388,
        "lon": 6.1225108
    }
];
