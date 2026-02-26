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
          "description": "El centre de referència universitari de la Suïssa romandía.",
          "chef_service": "Prof. Peter Vollenweider",
          "email_contact": "peter.vollenweider@chuv.ch",
          "categorie": "A",
          "accessibilite_etrangers": "Mittlana",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Académique",
          "encadrement_desc": "Supervisió excepcional però molt exigent. Ideal per a una carrera acadèmica.",
          "isfm_category": "A (3 anys)",
          "supervision_score": 4.9,
          "points_forts": ["Prestigi internacional", "Recerca de punta", "Casos complexos"],
          "points_faibles": ["Molt selectiu", "Cost de vida elevat", "C1 requerit estrictament"],
          "avis_assistant_resume": "La referència absoluta per formar-se, si tens el nivell i l'ambició.",
          "logement_type": "Cap (sector privat)",
          "logement_info": {
            "has_logement": true,
            "summary": "El CHUV disposa d'un Bureau des Logements que gestiona uns 376 estudis moblats a Lausana.",
            "options": [
              { "type": "Estudi moblat (15-34m²)", "prix": "650 - 1200 CHF/mes", "services": ["Cunina equipada", "Bany privat", "Moblat", "Traster"], "delai": "Prioritat a estrangers (permís B/L)" }
            ],
            "details": "Contractes de màxim 2 anys. No inclou Wifi (a càrrec de l'inquilí). Lloguer deduït del salari.",
            "contact": { "tel": "021 314 55 55", "mail": "bureau.logements@chuv.ch" }
          }
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
          "chef_service": "Dr. Timothée Favre-Bulle",
          "email_contact": "timothee.favre-bulle@ehnv.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Excel·lent",
          "encadrement_desc": "Sistema de tutoria individual estructurada i supervisió molt acollidora. Perfecte per a debutants.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.8,
          "points_forts": ["Supervisió de proximitat excepcional", "Ambient molt acollidor", "Hospital a escala humana"],
          "points_faibles": ["Càrrega de treball de vegades elevada", "Allunyament de la ciutat per a St-Loup"],
          "avis_assistant_resume": "Ideal per començar una carrera a Suïssa en un entorn molt supervisat i humà.",
          "logement_type": "Estudis moblats disponibles fàcilment",
          "logement_info": {
            "has_logement": true,
            "summary": "Allotjament disponible a Yverdon, Orbe i Saint-Loup per a col·laboradors i metges assistents.",
            "options": [
              { "site": "Yverdon", "type": "Estudi amb balcó (26m²)", "prix": "1026 CHF/mes", "services": ["Moblat", "Cuina", "Bugaderia", "Pàrquing (+80 CHF)"] },
              { "site": "Saint-Loup", "type": "Habitació amb bany", "prix": "250 CHF/mes", "services": ["Wifi", "Cuina comunitària", "Saló comú", "Bugaderia"] }
            ],
            "details": "L'allotjament a Saint-Loup és ideal per als qui no tenen cotxe inicialment ja que l'hospital està aïllat.",
            "contact": { "tel": "024 424 53 51", "mail": "inforh@ehnv.ch" }
          }
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
          "chef_service": "Dr. Nicole Doser",
          "email_contact": "nicole.doser@ehc.vd.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "30 min",
          "encadrement_niveau": "Molt bo",
          "encadrement_desc": "Una persona de referència per a la formació (Dra. Aebischer). Bon esperit d'equip i bon ambient.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.2,
          "points_forts": ["Proximitat immediata a Lausana", "Esperit d'equip dinàmic", "Infrastructures modernes"],
          "points_faibles": ["Buscar allotjament és complex a Morges", "Pressió temporal a les urgències"],
          "avis_assistant_resume": "Un excel·lent equilibri entre exigència clínica i vida al llac Leman, malgrat el cost de l'allotjament.",
          "logement_type": "Ajuda a la recerca (sense internat)"
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
          "chef_service": "Prof. Andrea Orlandini",
          "email_contact": "andrea.orlandini@hopitalrivierachablais.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h",
          "encadrement_niveau": "Estructurada",
          "encadrement_desc": "Metge formador dedicat (½ jornada/setmana). Visites diàries supervisades.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 3.9,
          "points_forts": ["Infrastructures noves de darrera tecnologia", "Formador dedicat a temps parcial", "Accés a la Riviera i al Lavaux"],
          "points_faibles": ["Cotxe indispensable per a Rennaz", "Negociacions en curs sobre les 46h"],
          "avis_assistant_resume": "Hospital magnífic i modern, ideal per a la tècnica, però l'accés per carretera és un punt negre.",
          "logement_type": "Allotjaments rars (preveure sector privat)"
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
          "chef_service": "Dr. David Chabanel",
          "email_contact": "consultation.chabanel@hibroye.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 10min",
          "encadrement_niveau": "Proximitat",
          "encadrement_desc": "Excel·lent supervisió: 1 Cap de Clínica per 2 unitats (assistent). Visita gran 2x per setmana.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.5,
          "points_forts": ["Supervisió molt present (CDC/2 unitats)", "Ambient de treball càlid", "Regió calmada i lloguers baixos"],
          "points_faibles": ["Menys casos ultra-complexos", "Aïllament geogràfic relatiu"],
          "avis_assistant_resume": "Un lloc ideal per aprendre les bases amb una supervisió de proximitat tranquil·litzadora.",
          "logement_type": "Estudis temporals al lloc",
          "logement_info": {
              "has_logement": true,
              "summary": "Disposen d'estudis temporals per a nous col·laboradors al mateix lloc de Payerne.",
              "options": [
                  { "type": "Estudi temporal moblat", "prix": "Preus atractius (consultar RH)", "services": ["A prop de l'hospital", "Bàsics inclosos"] }
              ],
              "contact": { "mail": "info@hibroye.ch" }
          }
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
          "chef_service": "Dr. Marcos Schwab",
          "email_contact": "marcos.schwab@ghol.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "20 min",
          "encadrement_niveau": "Excel·lent",
          "encadrement_desc": "Formació clau, visites supervisades al llit del malalt. Avaluació molt positiva.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.7,
          "points_forts": ["Ensenyament clínic d'alta qualitat", "Equip jove i unit", "Accés fàcil des de Ginebra"],
          "points_faibles": ["Estrès lligat al flux d'urgències", "Vida cara a Nyon"],
          "avis_assistant_resume": "Probablement un dels serveis de medicina més estimulants i formadors de la regió.",
          "logement_type": "Sense allotjament propi (necessari privat)"
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
          "chef_service": "Dr. Jacques Meizoz",
          "email_contact": "jmeizoz@genolier.net",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "25 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió directa pels metges tractants. Menys autonomia però entorn tranquil i formatiu.",
          "isfm_category": "C (1 any)",
          "supervision_score": 3.8,
          "points_forts": ["Entorn de treball luxuriós", "Supervisió directa per experts", "Ritme més serè"],
          "points_faibles": ["Autonomia limitada", "Menys casos aguts"],
          "avis_assistant_resume": "Ideal per aprofundir en la semiologia i els expedients complexos en un entorn tranquil.",
          "logement_type": "Cap"
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
          "chef_service": "Dr. Daniel V. Caviedes",
          "email_contact": "dcaviedes@lasource.ch",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Acompanyament d'alt nivell i molt bons avantatges.",
          "isfm_category": "C (1 any)",
          "supervision_score": 3.9,
          "points_forts": ["Centre-vila de Lausana", "Avantatges socials premium", "Tècniques de punta"],
          "points_faibles": ["Cost de la vida lausanès", "Poca autonomia de guàrdia"],
          "avis_expert": "Una clínica històrica amb un entorn de cura excepcional.",
          "logement_type": "Cap"
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
          "chef_service": "Dr. Gaël Bryois",
          "email_contact": "gael.bryois@hirslanden.ch",
          "categorie": "C",
          "accessibilite_etrangers": "Baixa",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Privada",
          "encadrement_desc": "Supervisió propera per la xarxa Hirslanden.",
          "isfm_category": "C (1 any)",
          "supervision_score": 3.9,
          "points_forts": ["Xarxa Hirslanden de renom", "Equipament de gamma alta", "Lausana centre"],
          "points_faibles": ["Autonomia de guàrdia limitada", "Allotjament molt car"],
          "avis_expert": "Una immersió en el sector privat de qualitat, ideal per al networking.",
          "logement_type": "Cap"
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
          "chef_service": "Dr. Pierre Guillemin",
          "email_contact": "pierre.guillemin@hopitaldelavaux.ch",
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
          "email_contact": "pierre-auguste.petignat@hopitalvs.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 50min",
          "encadrement_niveau": "Millorada (CCT)",
          "encadrement_desc": "Nova CCT 2025: setmana de 46h de les quals 4h garantides per a la formació postgraduada.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.4,
          "points_forts": ["CCT 2025 (46h amb formació pagada)", "Sion = 'Petita A' de qualitat", "Equips accessibles"],
          "points_faibles": ["Rotació elevada", "Gran càrrega administrativa"],
          "avis_assistant_resume": "Una infraestructura robusta i un aprenentatge ràpid gràcies a la varietat de casos clínics.",
          "logement_type": "Internats a Sion, Martigny i Monthey",
          "logement_info": {
            "has_logement": true,
            "summary": "L'Hospital del Valais ofereix nombroses habitacions i apartaments als seus 3 llocs principals.",
            "options": [
              { "site": "Sion (Préjeux)", "type": "Habitació (15m²)", "prix": "490 CHF/mes", "services": ["Bany privat", "Moblat", "Cuina comunitària", "Sense Wifi"] },
              { "site": "Sierre", "type": "Habitació / Estudi", "prix": "415 - 670 CHF/mes", "services": ["Wifi (+20 CHF)", "Moblat"] },
              { "site": "Martigny", "type": "Habitació / Estudi", "prix": "310 - 680 CHF/mes", "services": ["Moblat", "Bugaderia", "Opció Wifi"] }
            ],
            "details": "El pagament es fa normalment mitjançant deducció directa del salari.",
            "contact": { "tel": "027 603 97 97", "mail": "logements.chvr@hopitalvs.ch" }
          }
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
          "chef_service": "Dr. Stephane Zermatten",
          "email_contact": "szermatten@cliniquevalere.ch",
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
          "chef_service": "Prof. Julien Vaucher",
          "email_contact": "julien.vaucher@h-fr.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "BSL",
          "temps_aeroport": "1h 30min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps.",
          "isfm_category": "A/B (segons l'emplaçament)",
          "supervision_score": 4.1,
          "points_forts": ["Hospital bilingüe", "Volum de casos important", "Accés Universitari"],
          "points_faibles": ["Sobrecàrrega a les urgències", "Rotació dels quadres"],
          "avis_assistant_resume": "Una formació sòlida en un entorn bilingüe estimulant però exigent físicament.",
          "logement_type": "Friburg (internat moblat) i Riaz/Tavel",
          "logement_info": {
            "has_logement": true,
            "summary": "L'HFR gestiona diverses residències a Friburg i allotjament al mateix recinte a Riaz.",
            "options": [
              { "site": "Fribourg", "type": "Estudi / Habitació", "prix": "570 - 880 CHF/mes", "services": ["Moblat", "Despeses incloses", "A prop del transport"] },
              { "site": "Riaz", "type": "Habitació Agoriaz", "prix": "640 CHF/mes", "services": ["Al recinte hospitalari", "Bany privat", "Cuina compartida"] }
            ],
            "details": "L'oferta està pensada principalment per als primers mesos d'instal·lació.",
            "contact": { "tel": "026 306 05 60", "mail": "service.logement@h-fr.ch" }
          }
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
          "chef_service": "Dr. Marc-Antoine Gasser",
          "email_contact": "magasser@daler.ch",
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
          "email_contact": "jacques.donze@rhne.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "1h 20min",
          "encadrement_niveau": "Estructurada",
          "encadrement_desc": "1h de coaching individual/setmana + cursos dedicats. Autonomia progressiva després de la posada al dia.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.6,
          "points_forts": ["Coaching individual setmanal", "Autonomia progressiva guiada", "Bon ambient"],
          "points_faibles": ["Aïllament dels centres", "Meteorologia"],
          "avis_assistant_resume": "El coaching és un actiu important per als nouvinguts a Suïssa.",
          "logement_type": "Estudis disponibles (Neuchâtel/Chaux-de-Fonds)",
          "logement_info": {
            "has_logement": true,
            "summary": "El RHNe disposa de servei de reserves específic per a habitacions i estudis de col·laboradors.",
            "options": [
              { "type": "Habitació / Estudi moblat", "prix": "Aprox. 400-600 CHF/mes", "services": ["Prop de Pourtalès/CdF", "Gestionat per l'hospital"] }
            ],
            "contact": { "tel": "032 713 30 37", "mail": "reservations@rhne.ch" }
          }
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
          "chef_service": "Dr. Jean-Louis Zufferey",
          "email_contact": "jlzufferey@providence.ch",
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
          "email_contact": "herve.duplain@h-ju.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "B2",
          "aeroport_proche": "BSL",
          "temps_aeroport": "45 min",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió diària per un formador. Estructura més familiar i a escala humana.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.1,
          "points_forts": ["Atmosfera familiar", "Baix cost de la vida", "Jerarquia molt accessible"],
          "points_faibles": ["Allunyament dels grans centres", "Clima dur"],
          "avis_assistant_resume": "Una escola de medicina de proximitat tranquil·litzadora per a un primer any.",
          "logement_type": "Allotjaments disponibles sota petició",
          "logement_info": {
            "has_logement": true,
            "summary": "L'Hôpital du Jura disposa de 150 habitacions per a personal i estudiants.",
            "options": [
              { "site": "Delémont", "type": "Habitació", "prix": "310 - 350 CHF/mes", "services": ["Internet inclòs", "TV digital", "Moblat"] },
              { "site": "Porrentruy", "type": "Habitació / Estudi", "prix": "360 - 460 CHF/mes", "services": ["Bany privat (estudis)", "Internet"] }
            ],
            "contact": { "tel": "032 421 21 21", "mail": "aurelie.dobler@h-ju.ch" }
          }
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
          "chef_service": "Dr. Kafui Houegnifioh",
          "email_contact": "kafui.houegnifioh@reseaudelarc.net",
          "logement_info": {
            "has_logement": true,
            "summary": "L'HJB ofereix habitacions i apartaments tant a Moutier com a Saint-Imier.",
            "options": [
              { "site": "Moutier", "type": "Habitació / Apto 2p", "prix": "310 - 890 CHF/mes", "services": ["Maison du personnel", "Apartaments moblats"] },
              { "site": "Saint-Imier", "type": "Habitació / Estudi", "prix": "360 - 600 CHF/mes", "services": ["A prop de l'hospital", "Estudis disponibles"] }
            ],
            "contact": { "tel": "032 494 30 29", "mail": "carole.gobat@hjbe.ch" }
          },
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
          "chef_service": "Dr. Lauriane Poli",
          "email_contact": "lauriane.poli@latour.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Mitjana",
          "langue_requise": "B2/C1",
          "aeroport_proche": "GVA",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.3,
          "points_forts": ["Hospital privat de punta", "Urgència i reanimació al lloc", "Accés a l'aeroport immillorable"],
          "points_faibles": ["Exigència elevada", "Ritme sostingut"],
          "avis_assistant_resume": "La punta del privat amb una estructura que no té res a envejar al públic.",
          "logement_type": "Sector privat exclusivament"
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
          "chef_service": "Dr. Patrick Saudan",
          "email_contact": "psaudan@beaulieu.ch",
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
          "description": "Principal centre hospitalari acadèmic de Ginebra.",
          "chef_service": "Pr Jean-Luc Reny",
          "email_contact": "jean-luc.reny@hcuge.ch",
          "categorie": "A",
          "accessibilite_etrangers": "Mittlana",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "temps_aeroport": "15 min",
          "encadrement_niveau": "Universitaire",
          "encadrement_desc": "Estructura de formació d'alt nivell. C1 estrictament requerit per a l'admissió AOS.",
          "isfm_category": "A (3 anys)",
          "supervision_score": 4.7,
          "points_forts": ["Segell HUG prestigiós", "Xarxa internacional", "Proximitat Aeroport"],
          "points_faibles": ["Vida a Ginebra molt cara", "Selectivitat màxima"],
          "avis_assistant_resume": "L'opció número 1 per a aquells que volen estar al cor de l'acció mèdica ginebrina.",
          "logement_type": "Reserva d'allotjaments limitada (espera molt llarga)"
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
          "chef_service": "Pr Christophe Luthy",
          "email_contact": "christophe.luthy@hcuge.ch",
          "categorie": "B",
          "accessibilite_etrangers": "Alta",
          "langue_requise": "C1",
          "aeroport_proche": "GVA",
          "encadrement_niveau": "Estàndard",
          "encadrement_desc": "Supervisió hospitalària clàssica per caps de clínica i metges caps.",
          "isfm_category": "B (2 anys)",
          "supervision_score": 4.2,
          "points_forts": ["Prestigi HUG", "Xarxa acadèmica", "Formació estructurada"],
          "points_faibles": ["Pesadesa administrativa", "Allotjament molt complex a Ginebra"],
          "avis_assistant_resume": "L'assegurança del segell HUG amb una pràctica més clínica que al lloc central.",
          "logement_type": "Xarxa d'internats HUG (llarga espera)"
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
          "chef_service": "Dr. Pierre-Olivier Lang",
          "email_contact": "pierre-olivier.lang@jolimont.ch",
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
          "chef_service": "Dr. Jean-Luc Kurth",
          "email_contact": "jlkurth@cliniquecarouge.ch",
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
        name: "Aeroport de Ginebra (GVA)",
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
        name: "Aeroport de Basilea-Mulhouse (BSL)",
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
        name: "Aeroport de Zuric (ZRH)",
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
