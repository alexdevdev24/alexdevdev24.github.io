const HOSPITAL_DATA = {
  "suisse_francophone": [
    {
      "canton": "Vaud",
      "description": "Molt dens en hospitals perifèrics. Un dels majors proveïdors de places fora del centre universitari.",
      "hopitaux": [
        {
          "nom": "CHUV (Centre Hospitalier Universitaire Vaudois)",
          "sites": [
            {
              "ville": "Lausanne",
              "adresse": "Rue du Bugnon 46, 1011 Lausanne, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "Le centre de référence universitaire de Suisse romande.",
          "chef_service": "Prof. Gérard Waeber",
          "email_contact": "med-assistants@chuv.ch",
          "categorie": "A",
          "accessibilite_etrangers": "Mittlana",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Académique",
          "encadrement_desc": "Supervision exceptionnelle mais très exigeante. Idéal pour carrière académique.",
          "isfm_category": "A (3 ans)",
          "supervision_score": 4.9,
          "points_forts": ["Prestige international", "Recherche de pointe", "Cas complexes"],
          "points_faibles": ["Très sélectif", "Coût de la vie élevé", "C1 requis strict"],
          "avis_assistant_resume": "La référence absolue pour se former, si vous avez le niveau et l'ambition.",
          "logement_type": "Aucun (secteur privé)"
        },
        {
          "nom": "eHnv (Établissements Hospitaliers du Nord Vaudois)",
          "sites": [
            {
              "ville": "Yverdon-les-Bains",
              "adresse": "Rue d'Entremonts 11, 1400 Yverdon-les-Bains, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            },
            {
              "ville": "Saint-Loup",
              "adresse": "Hôpital de Saint-Loup, 1318 Pompaples, Suisse",
              "voiture_necessaire": true,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Molt reconegut per la formació bàsica.",
          "chef_service": "Dr. Jean-Christophe Laurent",
          "email_contact": "jean-christophe.laurent@ehnv.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Excel·lent",
          "encadrement_desc": "Sistema de tutoria individual estructurada i supervisió molt acollidora. Perfecte per a debutants.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.8,
          "points_forts": ["Supervisió de proximité exceptionnelle", "Ambiance très bienveillante", "Hôpital à taille humaine"],
          "points_faibles": ["Charge de travail parfois élevée", "Éloignement de la ville pour St-Loup"],
          "avis_assistant_resume": "Idéal pour commencer une carrière en Suisse dans un environnement ultra-encadré et humain.",
          "logement_type": "Studios meublés disponibles facilement"
        },
        {
          "nom": "EHC (Ensemble Hospitalier de la Côte)",
          "sites": [
            {
              "ville": "Morges",
              "adresse": "Chemin du Crêt 2, 1110 Morges, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$",
              "logement_personnel": false
            }
          ],
          "description": "Molt valorat per la seva proximitat a Lausana i Ginebra.",
          "chef_service": "Prof. Oscar Marchetti",
          "email_contact": "secretariat.departement.medecine@ehc.vd.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "30 min",
          "encadrement_niveau": "Molt bo",
          "encadrement_desc": "Una persona de referència per a la formació (Dra. Aebischer). Bon esperit d'equip i bon ambient.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.2,
          "points_forts": ["Proximité immédiate de Lausanne", "Esprit d'équipe dynamique", "Infrastructures modernes"],
          "points_faibles": ["Chercher un logement est complexe sur Morges", "Pression temporelle aux urgences"],
          "avis_assistant_resume": "Un excellent équilibre entre exigence clinique et vie lémanique, malgré le coût du logement.",
          "logement_type": "Aide à la recherche (pas d'internat)"
        },
        {
          "nom": "HRC (Hôpital Riviera-Chablais)",
          "sites": [
            {
              "ville": "Rennaz",
              "adresse": "Route du Vieux Séquoia 20, 1847 Rennaz, Suisse",
              "voiture_necessaire": true,
              "budget_loyer": "$$",
              "logement_personnel": false
            },
            {
              "ville": "Vevey",
              "adresse": "Avenue de la Prairie 3, 1800 Vevey, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": false
            },
            {
              "ville": "Monthey",
              "adresse": "Route de Choëx 21, 1870 Monthey, Suisse",
              "voiture_necessaire": true,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Un gran hospital intercantonal totalment nou.",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h",
          "encadrement_niveau": "Estructurada",
          "encadrement_desc": "Metge formador dedicat (½ jornada/setmana). Visites diàries supervisades.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 3.9,
          "points_forts": ["Infrastructures neuves de haute technologie", "Formateur dédié à temps partiel", "Accès Riviera et Lavaux"],
          "points_faibles": ["Voiture indispensable pour Rennaz", "Négociations en cours sur les 46h"],
          "avis_assistant_resume": "Hôpital magnifique et moderne, idéal pour la technique, mais l'accès routier est un point noir.",
          "logement_type": "Logements rares (prévoir secteur privé)"
        },
        {
          "nom": "HIB (Hôpital Intercantonal de la Broye)",
          "sites": [
            {
              "ville": "Payerne",
              "adresse": "Avenue de la Folie 8, 1530 Payerne, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$",
              "logement_personnel": true
            }
          ],
          "description": "Excel·lent per a una supervisió de proximitat.",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 10min",
          "encadrement_niveau": "Proximitat",
          "encadrement_desc": "Excel·lent supervisió: 1 Cap de Clínica per 2 unitats (assistent). Visita gran 2x per setmana.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.5,
          "points_forts": ["Supervision très présente (CDC/2 unités)", "Ambiance de travail chaleureuse", "Région calme et loyers bas"],
          "points_faibles": ["Moins de cas ultra-complexes", "Isolement géographique relatif"],
          "avis_assistant_resume": "Un lieu idéal pour apprendre les bases avec une supervision de proximité rassurance.",
          "logement_type": "Studios temporaires sur site"
        },
        {
          "nom": "GHOL (Groupement Hospitalier de l'Ouest Lémanique)",
          "sites": [
            {
              "ville": "Nyon",
              "adresse": "Chemin Monastier 10, 1260 Nyon, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$",
              "logement_personnel": false
            }
          ],
          "description": "Hospital perifèric molt valorat pels assistents, reconegut categoria B en medicina interna.",
          "categorie": "B",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "20 min",
          "encadrement_niveau": "Excel·lent",
          "encadrement_desc": "Formació clau, visites supervisades al llit del malalt. Avaluació molt positiva.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.7,
          "points_forts": ["Enseignement clinique de haute qualité", "Équipe jeune et soudée", "Accès facile depuis Genève"],
          "points_faibles": ["Stress lié au flux d'urgences", "Vie chère à Nyon"],
          "avis_assistant_resume": "Probablement l'un des services de médecine les plus stimulants et formateurs de la région.",
          "logement_type": "Pas de logement propre (privé nécessaire)"
        },
        {
          "nom": "Clinique de Genolier",
          "sites": [
            {
              "ville": "Genolier",
              "adresse": "Route du Muids 3, 1272 Genolier, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "Clínica privada de referència, amb reconeixement ISFM.",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "25 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió directa pels metges tractants. Menys autonomia però entorn tranquil i formatiu.",
          "isfm_category": "C (1 an)",
          "supervision_score": 3.8,
          "points_forts": ["Cadre de travail luxueux", "Supervision directe par des experts", "Rythme plus serein"],
          "points_faibles": ["Autonomie limitée", "Moins de cas aigus"],
          "avis_assistant_resume": "Idéal pour approfondir la sémiologie et les dossiers complexes dans un cadre paisible.",
          "logement_type": "Aucun"
        },
        {
          "nom": "Clinique de La Source",
          "sites": [
            {
              "ville": "Lausanne",
              "adresse": "Avenue Vinet 30, 1004 Lausanne, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$",
              "logement_personnel": false
            }
          ],
          "description": "Clínica d'avantguarda que ofereix excel·lents oportunitats d'especialització.",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Acompanyament d'alt nivell i molt bons avantatges.",
          "isfm_category": "C (1 an)",
          "supervision_score": 3.9,
          "points_forts": ["Centre-ville de Lausanne", "Avantages sociaux premium", "Techniques de pointe"],
          "points_faibles": ["Coût de la vie lausannois", "Peu d'autonomie garde"],
          "avis_expert": "Une clinique historique avec un cadre de soin d'exception.",
          "logement_type": "Aucun"
        },
        {
          "nom": "Clinique Cecil",
          "sites": [
            {
              "ville": "Lausanne",
              "adresse": "Avenue Ruchonnet 53, 1003 Lausanne, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$",
              "logement_personnel": false
            }
          ],
          "description": "Establiment de la xarxa Hirslanden, servei de medicina interna reconegut.",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió propera per la xarxa Hirslanden.",
          "isfm_category": "C (1 an)",
          "supervision_score": 3.9,
          "points_forts": ["Réseau Hirslanden réputé", "Équipement haut de gamme", "Lausanne centre"],
          "points_faibles": ["Autonomie garde limitée", "Logement très onéreux"],
          "avis_expert": "Une immersion dans le secteur privé de qualité, idéal pour le réseautage.",
          "logement_type": "Aucun"
        },
        {
          "nom": "Hôpital de Lavaux",
          "sites": [
            {
              "ville": "Cully",
              "adresse": "Route de la Petite-Corniche 1, 1096 Bourg-en-Lavaux, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "Hospital que ofereix sovint rehabilitació i medicina interna amb reconeixement.",
          "categorie": "C",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "55 min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps."
        }
      ]
    },
    {
      "canton": "Valais",
      "description": "La part francòfona recluta molts metges formats a l'estranger.",
      "hopitaux": [
        {
          "nom": "Hôpital du Valais (CHVR)",
          "sites": [
            {
              "ville": "Sion",
              "adresse": "Avenue du Grand-Champsec 80, 1950 Sion, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            },
            {
              "ville": "Sierre",
              "adresse": "Rue Saint-Charles 14, 3960 Sierre, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            },
            {
              "ville": "Martigny",
              "adresse": "Avenue de la Fusion 27, 1920 Martigny, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Per a moltes especialitats, Sion funciona gairebé com un 'petit A'.",
          "chef_service": "Prof. Pierre-Auguste Petignat",
          "email_contact": "p-a.petignat@hopitalvs.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 50min",
          "encadrement_niveau": "Millorada (CCT)",
          "encadrement_desc": "Nova CCT 2025: setmana de 46h de les quals 4h garantides per a la formació postgraduada.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.4,
          "points_forts": ["CCT 2025 (46h avec formation payée)", "Sion = 'Petite A' de qualité", "Équipes accessibles"],
          "points_faibles": ["Turnover élevé", "Grosse charge administrative"],
          "avis_assistant_resume": "Une infrastructure robuste et un apprentissage rapide grâce à la variété des cas cliniques.",
          "logement_type": "Internats à Sion, Martigny et Monthey"
        },
        {
          "nom": "Clinique de Valère",
          "sites": [
            {
              "ville": "Sion",
              "adresse": "Rue de l'Industrie 29, 1950 Sion, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Clínica privada amb infraestructures d'alt nivell i places per a medicina interna.",
          "categorie": "C",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 50min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió pels metges clínics acreditats de la clínica."
        }
      ]
    },
    {
      "canton": "Fribourg",
      "description": "Cantó bilingüe, seus principals francòfones o bilingües.",
      "hopitaux": [
        {
          "nom": "HFR (Hôpital fribourgeois)",
          "sites": [
            {
              "ville": "Fribourg",
              "adresse": "Chemin des Pensionnats 2-6, 1708 Fribourg, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            },
            {
              "ville": "Riaz",
              "adresse": "Rue de l'Hôpital 9, 1632 Riaz, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            },
            {
              "ville": "Tavel",
              "adresse": "Maggenberg 1, 1712 Tafers, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Gran pol de categoria B amb hospitals perifèrics per a medicina interna bàsica.",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "BSL",
          "temps_aeroport": "1h 30min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps.",
          "isfm_category": "A/B (selon site)",
          "supervision_score": 4.1,
          "points_forts": ["Hôpital bilingue", "Volume de cas important", "Accès Universitaire"],
          "points_faibles": ["Surcharge aux urgences", "Turnover des cadres"],
          "avis_assistant_resume": "Une formation solide dans un environnement bilingue stimulant mais exigeant physiquement.",
          "logement_type": "Fribourg (internat meublé) et Riaz/Tavel"
        },
        {
          "nom": "Hôpital Daler",
          "sites": [
            {
              "ville": "Fribourg",
              "adresse": "Route de Bertigny 34, 1700 Fribourg, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Hospital privat de cures agudes que ofereix places en medicina interna (Cat C).",
          "categorie": "C",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "BSL",
          "temps_aeroport": "1h 30min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps."
        }
      ]
    },
    {
      "canton": "Neuchâtel",
      "description": "Establiments molt complets.",
      "hopitaux": [
        {
          "nom": "RHNe (Réseau Hospitalier Neuchâtelois)",
          "sites": [
            {
              "ville": "Neuchâtel (Pourtalès)",
              "adresse": "Rue de la Maladière 45, 2000 Neuchâtel, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            },
            {
              "ville": "La Chaux-de-Fonds",
              "adresse": "Rue de Chasseral 20, 2300 La Chaux-de-Fonds, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$",
              "logement_personnel": true
            }
          ],
          "description": "Establiments de categoria B molt complets per a la majoria d'especialitats.",
          "chef_service": "Prof. Jacques Donzé",
          "email_contact": "secretariat.dmi@rhne.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 20min",
          "encadrement_niveau": "Estructurada",
          "encadrement_desc": "1h de coaching individual/setmana + cursos dedicats. Autonomia progressiva després de la posada al dia.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.6,
          "points_forts": ["Coaching individuel hebdomadaire", "Autonomie progressive guidée", "Bonne ambiance"],
          "points_faibles": ["Isolement des sites", "Météo"],
          "avis_assistant_resume": "Le coaching est un atout majeur pour les nouveaux arrivants en Suisse.",
          "logement_type": "Studios disponibles (Neuchâtel/Chaux-de-Fonds)"
        },
        {
          "nom": "Hôpital de la Providence",
          "sites": [
            {
              "ville": "Neuchâtel",
              "adresse": "Faubourg de l'Hôpital 81, 2000 Neuchâtel, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$",
              "logement_personnel": true
            }
          ],
          "description": "Clínica establerta a Neuchâtel, pertanyent al grup Swiss Medical Network.",
          "categorie": "C",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 20min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps."
        }
      ]
    },
    {
      "canton": "Jura & Jura Bernois",
      "description": "Ideal per trobar un primer lloc de treball més fàcilment.",
      "hopitaux": [
        {
          "nom": "H-JU (Hôpital du Jura)",
          "sites": [
            {
              "ville": "Delémont",
              "adresse": "Faubourg des Capucins 30, 2800 Delémont, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$",
              "logement_personnel": true
            },
            {
              "ville": "Porrentruy",
              "adresse": "Chemin de l'Hôpital 9, 2900 Porrentruy, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$",
              "logement_personnel": true
            }
          ],
          "description": "Xarxa principal del cantó del Jura.",
          "chef_service": "Dr. Hervé Duplain",
          "email_contact": "Herve.Duplain@h-ju.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "BSL",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió diària per un formador. Estructura més familiar i a escala humana.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.1,
          "points_forts": ["Atmosphère familiale", "Faible coût de la vie", "Hiérarchie très accessible"],
          "points_faibles": ["Éloignement des grands centres", "Météo rude"],
          "avis_assistant_resume": "Une école de médecine de proximité rassurante pour une première année.",
          "logement_type": "Logements disponibles sur demande"
        },
        {
          "nom": "Hôpital du Jura Bernois",
          "sites": [
            {
              "ville": "Moutier",
              "adresse": "Beausite 49, 2740 Moutier, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$",
              "logement_personnel": true
            },
            {
              "ville": "Saint-Imier",
              "adresse": "Les Fontenayes 17, 2610 Saint-Imier, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$",
              "logement_personnel": true
            }
          ],
          "description": "Situat a la part francòfona del cantó de Berna.",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "BSL",
          "temps_aeroport": "1h 10min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps."
        }
      ]
    },
    {
      "canton": "Genève",
      "description": "Les places B i C es troben principalment en el sector privat o parapúblic.",
      "hopitaux": [
        {
          "nom": "Hôpital de La Tour",
          "sites": [
            {
              "ville": "Meyrin",
              "adresse": "Avenue J.-D.-Maillard 3, 1217 Meyrin, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "El més gran hospital privat de Ginebra amb urgències i cures intensives.",
          "categorie": "B",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.3,
          "points_forts": ["Hôpital privé de pointe", "Urgence et réanimation sur site", "Accès aéroport imbattable"],
          "points_faibles": ["Exigence élevée", "Rythme soutenu"],
          "avis_assistant_resume": "La pointe du privé avec une structure qui n'a rien à envier au public.",
          "logement_type": "Secteur privé uniquement"
        },
        {
          "nom": "Générale-Beaulieu et Grangettes",
          "sites": [
            {
              "ville": "Genève",
              "adresse": "Chemin de Beau-Soleil 20, 1206 Genève, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            },
            {
              "ville": "Chêne-Bougeries",
              "adresse": "Chemin des Grangettes 7, 1224 Chêne-Bougeries, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "Establiments privats reconeguts per a certes especialitats.",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "25 min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps."
        },
        {
          "nom": "HUG (Hôpitaux Universitaires de Genève)",
          "sites": [
            {
              "ville": "Genève",
              "adresse": "Rue Gabrielle-Perret-Gentil 4, 1205 Genève, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "Principal centre hospitalier académique de Genève.",
          "chef_service": "Prof. Arnaud Perrier",
          "email_contact": "med-assistants@hug.ch",
          "categorie": "A",
          "accessibilite_etrangers": "Mittlana",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "15 min",
          "encadrement_niveau": "Universitaire",
          "encadrement_desc": "Structure de formation de haut niveau. C1 strictement requis pour l'admission AOS.",
          "isfm_category": "A (3 ans)",
          "supervision_score": 4.7,
          "points_forts": ["Label HUG prestigieux", "Réseau international", "Proximité Aéroport"],
          "points_faibles": ["Vie à Genève très chère", "Sélectivité maximale"],
          "avis_assistant_resume": "Le choix numéro 1 pour ceux qui veulent être au cœur de l'action médicale genevoise.",
          "logement_type": "Réserve de logements limitée (très longue attente)"
        },
        {
          "nom": "HUG (Sites Périphériques)",
          "sites": [
            {
              "ville": "Thônex (Trois-Chêne)",
              "adresse": "Chemin du Pont-Bochet 3, 1226 Thônex, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$",
              "logement_personnel": false
            },
            {
              "ville": "Collonge-Bellerive",
              "adresse": "Chemin de la Savonnière 11, 1245 Collonge-Bellerive, Suisse",
              "voiture_necessaire": true,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            },
            {
              "ville": "Bernex (Loëx)",
              "adresse": "Route de Loëx 151, 1233 Bernex, Suisse",
              "voiture_necessaire": true,
              "budget_loyer": "$$$",
              "logement_personnel": false
            }
          ],
          "description": "Ofereixen places d'assistent molt orientades a medicina interna, geriatria i rehabilitació.",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.2,
          "points_forts": ["Prestige HUG", "Réseau académique", "Formation structurée"],
          "points_faibles": ["Lourdeur administrative", "Logement très complexe à Genève"],
          "avis_assistant_resume": "L'assurance du label HUG avec une pratique plus clinique que sur le site central.",
          "logement_type": "Réseau internat HUG (longue attente)"
        },
        {
          "nom": "Clinique de Joli-Mont",
          "sites": [
            {
              "ville": "Genève",
              "adresse": "Avenue Trembley 43, 1209 Genève, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$$",
              "logement_personnel": false
            }
          ],
          "description": "Situada davant dels HUG per a sinergies de continuïtat de cures i readaptació.",
          "categorie": "C",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "15 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió pels metges clínics acreditats de la clínica."
        },
        {
          "nom": "Clinique de Carouge",
          "sites": [
            {
              "ville": "Carouge",
              "adresse": "Avenue Cardinal-Mermillod 1, 1227 Carouge, Suisse",
              "voiture_necessaire": false,
              "budget_loyer": "$$$",
              "logement_personnel": false
            }
          ],
          "description": "Establiment privat que ofereix oportunitats en medicina (Cat C).",
          "categorie": "C",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "20 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió pels metges clínics acreditats de la clínica."
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
    "Chemin des Grangettes 7, 1224 Chêne-Bougeries, Suisse": [46.1998578, 6.1819624],
    "Chemin Monastier 10, 1260 Nyon, Suisse": [46.3832002, 6.2275115],
    "Route du Muids 3, 1272 Genolier, Suisse": [46.4450124, 6.21617],
    "Avenue Vinet 30, 1004 Lausanne, Suisse": [46.5273345, 6.6278991],
    "Avenue Ruchonnet 53, 1003 Lausanne, Suisse": [46.5202695, 6.6215907],
    "Route de la Petite-Corniche 1, 1096 Bourg-en-Lavaux, Suisse": [46.4987803, 6.7071487],
    "Chemin du Pont-Bochet 3, 1226 Thônex, Suisse": [46.2084435, 6.2154734],
    "Chemin de la Savonnière 11, 1245 Collonge-Bellerive, Suisse": [46.2586134, 6.2059847],
    "Route de Loëx 151, 1233 Bernex, Suisse": [46.1986837, 6.0846064],
    "Avenue Trembley 43, 1209 Genève, Suisse": [46.2213011, 6.1184724],
    "Avenue Cardinal-Mermillod 1, 1227 Carouge, Suisse": [46.1867663, 6.1425067],
    "Route de Bertigny 34, 1700 Fribourg, Suisse": [46.8009218, 7.1407993],
    "Faubourg de l'Hôpital 81, 2000 Neuchâtel, Suisse": [46.9952645, 6.9394811],
    "Rue de l'Industrie 29, 1950 Sion, Suisse": [46.2270013, 7.3631468],
    "Rue du Bugnon 46, 1011 Lausanne, Suisse": [46.5255, 6.6416],
    "Rue Gabrielle-Perret-Gentil 4, 1205 Genève, Suisse": [46.1931, 6.1479]
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
            frequency: "Cada dia (mínim 3 vols/dia)",
            avgPrice: "50-150 CHF"
        },
        transport: {
            type: "Train",
            description: "Estació CFF directament a l'aeroport (Ginebra-Aeroport)."
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
            frequency: "Cada dia (mínim 2 vols/dia)",
            avgPrice: "40-120 CHF"
        },
        transport: {
            type: "Bus/Train",
            description: "Autobús des de l'estació de Basilea CFF (15 min)."
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
            frequency: "Cada dia (mínim 5 vols/dia)",
            avgPrice: "80-200 CHF"
        },
        transport: {
            type: "Train",
            description: "Gran estació CFF sota l'aeroport."
        }
    }
];
