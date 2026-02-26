/**
 * French-Catalan Comparative Matrix for DALF C1
 * Strategic Language Bridges & High-Level Reference
 */

const COMPARATIVE_MATRIX = {
    tenses: [
        {
            id: 'present',
            fr: 'Le Présent',
            ca: 'El Present',
            usage: 'Identique pour les vérités générales et habitudes.',
            nuanceC1: "Attention au 'Présent de Narration' en français pour dynamiser les récits, très fréquent dans les synthèses de documents.",
            interference: "L'usage du présent pour exprimer un futur proche est plus fréquent en français qu'en catalan formel."
        },
        {
            id: 'imparfait',
            fr: "L'Imparfait",
            ca: "L'Imperfet",
            usage: 'Descriptions et habitudes passées.',
            nuanceC1: 'Utilisé pour la politesse (Si vous pouviez m\'aider...) ou pour exprimer une hypothèse (Si + imparfait).',
            interference: 'Attention à la concordance des temps en discours indirect rapportant des paroles au passé.'
        },
        {
            id: 'passe-compose',
            fr: 'Le Passé Composé',
            ca: 'El Passat Compost / Perifràstic',
            usage: 'Actions ponctuelles et achevées.',
            nuanceC1: "C'est le temps roi de l'oral et des comptes-rendus C1.",
            interference: "Contrairement au catalan 'vaig anar', le passé composé français marque un lien psychologique plus fort avec le présent."
        },
        {
            id: 'plus-que-parfait',
            fr: 'Le Plus-que-parfait',
            ca: 'El Plusquamperfet',
            usage: 'Action antérieure à une autre action passée.',
            nuanceC1: 'Indispensable pour structurer un récit complexe et les hypothèses sur le passé (Si + PQP).',
            interference: 'Utilisé en français pour exprimer un regret ou un souhait (Ah ! Si j\'avais su !).'
        },
        {
            id: 'subjonctif-present',
            fr: 'Le Subjonctif Présent',
            ca: 'El Subjuntiu Present',
            usage: 'Expression du doute, du désir, de la nécessité.',
            nuanceC1: "Maîtriser les conjonctifs complexes : 'bien que', 'quoique', 'pourvu que'.",
            interference: "CRITIQUE : Pas de subjonctif après 'si' en français (Si j'avais...), contrairement au catalan (Si hagués...)."
        },
        {
            id: 'conditionnel-present',
            fr: 'Le Conditionnel Présent',
            ca: 'El Condicional Present',
            usage: 'Hypothèses, politesse, futur dans le passé.',
            nuanceC1: "Usage journalistique pour les rumeurs ('Le ministre serait impliqué').",
            interference: "Sert de futur dans le passé lors du passage du discours direct au discours indirect."
        },
        {
            id: 'conditionnel-passe',
            fr: 'Le Conditionnel Passé',
            ca: 'El Condicional Passat',
            usage: 'Regrets, reproches, hypothèses non réalisées.',
            nuanceC1: "Structure pivot du C1 : 'Si' + PQP → Conditionnel Passé.",
            interference: 'Formé avec l\'auxiliaire au conditionnel présent + participe passé.'
        }
    ],

    connectors: [
        {
            category: 'Concession / Opposition',
            items: [
                { fr: 'Toutefois / Néanmoins', ca: 'Tanmateix / No obstant això', use: 'Nuance forte, registre soutenu.' },
                { fr: 'Bien que (+ subjonctif)', ca: 'Encara que / Tot i que', use: 'Indispensable pour argumenter.' },
                { fr: 'En revanche / Par contre', ca: 'En canvi / Per contra', use: 'Marquer un contraste entre deux faits.' },
                { fr: 'Pourtant / Cependant', ca: 'Malgrat tot / Tanmateix', use: 'Opposer une conséquence inattendue.' }
            ]
        },
        {
            category: 'Cause',
            items: [
                { fr: 'Étant donné que / Puisque', ca: 'Atès que / Ja que', use: 'Justification évidente ou connue.' },
                { fr: 'En raison de / Du fait de', ca: 'A causa de / Pel fet de', use: 'Style administratif ou formel.' },
                { fr: 'D\'autant plus que', ca: 'Tant més com que', use: 'Ajouter une cause supplémentaire forte.' }
            ]
        },
        {
            category: 'Conséquence',
            items: [
                { fr: 'Par conséquent / Dès lors', ca: 'Per tant / Per consegüent', use: 'Rigueur démonstrative.' },
                { fr: 'D\'où / Par là même', ca: "D'aquí que / Per això mateix", use: 'Lien logique direct et rapide.' },
                { fr: 'Si bien que / À tel point que', ca: 'De manera que / Fins a tal punt que', use: 'Exprimer le degré du résultat.' }
            ]
        }
    ],

    interferences: [
        {
            title: "Les pronoms adverbiaux (Le miroir parfait)",
            description: "C'est l'atout majeur. 'EN' et 'Y' fonctionnent comme 'EN' et 'HI' en catalan.",
            examples: [
                { fr: "J'en viens.", ca: "En vinc.", note: "Provenance / De + Nom" },
                { fr: "J'y vais.", ca: "Hi vaig.", note: "Lieu / À + Nom" }
            ]
        },
        {
            title: "Le 'NE' Explétif",
            description: "Après 'avant que', 'à moins que', 'avoir peur que'. N'existe pas vraiment en catalan moderne.",
            examples: [
                { fr: "Avant qu'il ne parte.", ca: "Abans que se'n vagi.", note: "Le 'ne' n'a aucune valeur négative." }
            ]
        },
        {
            title: "Si + Imparfait/PQP",
            description: "En français, jamais de subjonctif après 'SI'.",
            examples: [
                { fr: "Si j'avais (imparfait) su...", ca: "Si hagués (subj. passat) sabut...", note: "Piège fréquent pour les catalanophones." }
            ]
        }
    ]
};
