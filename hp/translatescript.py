import re

with open('/home/alex/Bureau/alexdevdev24.github.io/hp/script.js', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    "Vols vers Barcelone (BCN)": "Vols a Barcelona (BCN)",
    "Durée vol:": "Durada del vol:",
    "Fréquence:": "Freqüència:",
    "Compagnies:": "Companyies:",
    "Prix moyen:": "Preu mitjà:",
    "Voir sur Google Flights": "Veure a Google Flights",
    "Aucun hôpital ne correspond à ces critères": "Cap hospital no coincideix amb aquests criteris",
    "Réinitialiser les filtres": "Restablir els filtres",
    "Aucun favori encore": "Encara no hi ha favorits",
    "Cliquez sur ♡ sur une carte": "Fes clic a ♡ a una fitxa",
    "Chef:": "Cap:",
    "Email Chef de Service": "Email Cap de Servei",
    "Chercher Contact": "Cercar Contacte",
    "Contact": "Contacte",
    "Offres": "Ofertes",
    "Lettre IA": "Carta IA",
    "Score ": "Puntuació ",
    "Langue requise : ": "Idioma requerit: ",
    "Encadrement :": "Supervisió:",
    "Afficher la carte": "Mostrar el mapa",
    "Masquer la carte": "Amagar el mapa",
    "Génération en cours...": "Generant...",
    "Veuillez entrer une clé API.": "Si us plau, introdueix una clau API.",
    "Une erreur inattendue": "Un error inesperat",
    "est survenue": "s'ha produït",
    "Erreur (API)": "Error (API)",
    "Aucune réponse valide": "Cap resposta vàlida",
    "vol)": "vol)",
    "DURÉE VOL": "DURADA VOL",
    "PRIX EST.": "PREU EST."
}

for k, v in replacements.items():
    text = text.replace(k, v)

# Regex replacements for strings with variables
text = re.sub(r'`(\$\{totalCount\}) établissements trouvés`', r'`\1 establiments trobats`', text)
text = re.sub(r'`(\$\{totalCount\}) établissement trouvé`', r'`\1 establiment trobat`', text)
# eHnv has "eHnv (Établissements Hospitaliers du Nord Vaudois)" and data.js will have it translated maybe. But script.js might be mostly code.

with open('/home/alex/Bureau/alexdevdev24.github.io/hp/script.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("script.js translated to Catalan")
