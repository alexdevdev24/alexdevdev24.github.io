import json
import re

with open('/home/alex/Bureau/alexdevdev24.github.io/hp/data.js', 'r') as f:
    content = f.read()

# Extract HOSPITAL_DATA
match = re.search(r'const HOSPITAL_DATA = (\{.*?\n(?:  \]\n)?\});\n', content, re.DOTALL)
if not match:
    print("Could not find HOSPITAL_DATA JSON block")
    exit(1)

json_str = match.group(1)
try:
    data = json.loads(json_str)
except Exception as e:
    print(f"Error parsing JSON: {e}")
    exit(1)

encadrement_info = {
    "eHnv (Établissements Hospitaliers du Nord Vaudois)": {
        "niveau": "Excellent",
        "desc": "Système de parrainage individuel structuré et encadrement très bienveillant. Parfait pour débuter."
    },
    "EHC (Ensemble Hospitalier de la Côte)": {
        "niveau": "Très bon",
        "desc": "Une personne référente pour la formation (Dre Aebischer). Bon esprit d'équipe et bonne ambiance."
    },
    "HRC (Hôpital Riviera-Chablais)": {
        "niveau": "Structuré",
        "desc": "Médecin formateur dédié (1/2 journée/semaine). Visites quotidiennes encadrées."
    },
    "HIB (Hôpital Intercantonal de la Broye)": {
        "niveau": "Proximité",
        "desc": "Excellente supervision : 1 Chef de Clinique pour 2 unités (assistant). Grande visite 2x par semaine."
    },
    "GHOL (Groupement Hospitalier de l'Ouest Lémanique)": {
        "niveau": "Excellent",
        "desc": "Formation clé, visites encadrées au lit du malade. Évalué de manière très positive."
    },
    "Hôpital du Valais (CHVR)": {
        "niveau": "Amélioré (CCT)",
        "desc": "Nouvelle CCT 2025: semaine de 46h dont 4h garanties pour la formation postgraduée."
    },
    "HFR Fribourg - Hôpital Cantonal": {
        "niveau": "Difficile",
        "desc": "Risque de surmenage avec des heures supplémentaires. Sentiment rapporté de 'devoir se débrouiller seul'."
    },
    "RHNe (Réseau Hospitalier Neuchâtelois)": {
        "niveau": "Structuré",
        "desc": "1h de coaching individuel/semaine + cours dédiés. Autonomie progressive après mise au courant."
    },
    "H-JU (Hôpital du Jura)": {
        "niveau": "Standard",
        "desc": "Supervision quotidienne par un formateur. Structure plus familiale et à taille humaine."
    },
    "Clinique de Genolier": {
        "niveau": "Privé",
        "desc": "Supervision directe par les médecins traitants. Moins d'autonomie mais environnement calme et formateur."
    },
    "Clinique de La Source": {
        "niveau": "Privé",
        "desc": "Accompagnement de haut niveau et très bons avantages."
    },
    "Clinique Cecil": {
        "niveau": "Privé",
        "desc": "Encadrement rapproché par le réseau Hirslanden."
    }
}

for region in data['suisse_francophone']:
    for hosp in region['hopitaux']:
        nom = hosp['nom']
        info = encadrement_info.get(nom)
        if info:
            hosp['encadrement_niveau'] = info['niveau']
            hosp['encadrement_desc'] = info['desc']
        else:
            if "Clinique" in nom:
                hosp['encadrement_niveau'] = "Privé"
                hosp['encadrement_desc'] = "Encadrement par les médecins cliniciens accrédités de la clinique."
            else:
                hosp['encadrement_niveau'] = "Standard"
                hosp['encadrement_desc'] = "Encadrement hospitalier classique par des chefs de clinique et médecins-chefs."

new_json_str = json.dumps(data, indent=2, ensure_ascii=False)
new_content = content[:match.start()] + 'const HOSPITAL_DATA = ' + new_json_str + ';\n' + content[match.end():]

with open('/home/alex/Bureau/alexdevdev24.github.io/hp/data.js', 'w') as f:
    f.write(new_content)

print("data.js successfully updated!")
