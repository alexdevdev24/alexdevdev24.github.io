/**
 * French Verb Tenses Data for DALF C1
 * UI Language: Catalan
 */

const TENSES_DATA = [
    {
        id: 'present',
        nameFR: 'Le Présent',
        nameCA: 'El Present',
        usage: 'S\'utilitza per a accions que succeeixen en el moment de la parla, veritats generals o hàbits.',
        formation: 'Es forma amb l\'arrel del verb i les terminacions: <span>-e, -es, -e, -ons, -ez, -ent</span> (per al primer grup).',
        examples: [
            { fr: "Je parle français avec mes amis.", ca: "Parlo francès amb els meus amics." },
            { fr: "Nous étudions pour le DALF C1.", ca: "Estem estudiant per al DALF C1." },
            { fr: "La Terre tourne autour du Soleil.", ca: "La Terra gira al voltant del Sol." }
        ],
        c1tip: "A nivell C1, el present s'utilitza sovint en comentaris de text o anàlisis literàries per descriure accions d'una obra (el 'present històric' o 'literari').",
        timeline: 'present'
    },
    {
        id: 'imparfait',
        nameFR: 'L\'Imparfait',
        nameCA: 'L\'Imperfet',
        usage: 'S\'utilitza per a descripcions, accions habituals en el passat o accions que estaven en curs.',
        formation: 'Arrel de la 1a persona del plural (nous) del present + <span>-ais, -ais, -ait, -ions, -iez, -aient</span>.',
        examples: [
            { fr: "Quand j'étais petit, je lisais beaucoup.", ca: "Quan era petit, llegia molt." },
            { fr: "Il faisait beau ce jour-là.", ca: "Feia bon temps aquell dia." },
            { fr: "Nous marchions dans la rue quand il a commencé à pleuvoir.", ca: "Caminàvem pel carrer quan va començar a ploure." }
        ],
        c1tip: "Compte amb l'ús de l'imperfet en el discurs indirecte per respectar la concordança de temps quan el verb principal està en passat.",
        timeline: 'past-duration'
    },
    {
        id: 'passe-compose',
        nameFR: 'Le Passé Composé',
        nameCA: 'El Passat Compost',
        usage: 'S\'utilitza per a accions puntuals i acabades en el passat.',
        formation: 'Auxiliar <span>être</span> o <span>avoir</span> al present + participi passat.',
        examples: [
            { fr: "J'ai fini mes devoirs.", ca: "He acabat els deures." },
            { fr: "Elle est allée à Paris l'été dernier.", ca: "Ella va anar a París l'estiu passat." },
            { fr: "Nous avons mangé dans un bon restaurant.", ca: "Hem menjat en un bon restaurant." }
        ],
        c1tip: "Recorda l'acord del participi passat amb l'auxiliar 'être' i amb 'avoir' si el COD precedeix el verb.",
        timeline: 'past-point'
    },
    {
        id: 'passe-simple',
        nameFR: 'Le Passé Simple',
        nameCA: 'El Passat Simple',
        usage: 'S\'utilitza gairebé exclusivament en la llengua escrita (literatura, periodisme) per a accions puntuals en el passat.',
        formation: 'Terminacions varien segons el grup: <span>-ai, -as, -a, -âmes, -âtes, -èrent</span> (1r grup).',
        examples: [
            { fr: "Il naquit en 1900.", ca: "Va néixer l'any 1900." },
            { fr: "Ils arrivèrent à l'aube.", ca: "Van arribar a l'alba." },
            { fr: "Le roi mourut sans héritier.", ca: "El rei va morir sense hereu." }
        ],
        c1tip: "A l'examen C1, saber reconèixer-lo és vital per a la comprensió escrita. Molts verbs irregulars canvien totalment l'arrel.",
        timeline: 'past-literary'
    },
    {
        id: 'plus-que-parfait',
        nameFR: 'Le Plus-que-parfait',
        nameCA: 'El Plusquamperfet',
        usage: 'Indica una acció anterior a una altra acció passada.',
        formation: 'Auxiliar <span>être</span> o <span>avoir</span> a l\'imperfet + participi passat.',
        examples: [
            { fr: "Il avait déjà fini quand je suis arrivé.", ca: "Ell ja havia acabat quan jo vaig arribar." },
            { fr: "J'avais perdu mes clés.", ca: "Havia perdut les claus." },
            { fr: "Nous étions partis avant la fête.", ca: "Havent marxat abans de la festa." }
        ],
        c1tip: "Essencial per a la concordança de temps en relats complexos. Sovint substitueix el passé composé en el discurs indirecte si l'acord original era passat.",
        timeline: 'past-before-past'
    },
    {
        id: 'futur-simple',
        nameFR: 'Le Futur Simple',
        nameCA: 'El Futur Simple',
        usage: 'Accions que passaran en el futur, promeses o probabilitats.',
        formation: 'Infinitiu (o arrel irregular) + <span>-ai, -as, -a, -ons, -ez, -ont</span>.',
        examples: [
            { fr: "J'irai en France l'année prochaine.", ca: "Aniré a França l'any que ve." },
            { fr: "Nous mangerons ensemble demain.", ca: "Demà dinarem junts." },
            { fr: "Il fera beau demain.", ca: "Demà farà bo." }
        ],
        c1tip: "En textos periodístics, s'utilitza sovint el 'futur de conjecture' per a fets històrics o esdeveniments futurs molt probables.",
        timeline: 'future'
    },
    {
        id: 'futur-anterieur',
        nameFR: 'Le Futur Antérieur',
        nameCA: 'El Futur Anterior',
        usage: 'Una acció futura que estarà acabada abans d\'una altra acció futura, o una suposició sobre el passat.',
        formation: 'Auxiliar <span>être</span> o <span>avoir</span> al futur simple + participi passat.',
        examples: [
            { fr: "J'aurai fini ce livre demain.", ca: "Hauré acabat aquest llibre demà." },
            { fr: "Quand tu arriveras, nous aurons déjà mangé.", ca: "Quan arribis, ja haurem menjat." },
            { fr: "Il aura oublié son rendez-vous.", ca: "S'haurà oblidat de la seva cita." }
        ],
        c1tip: "S'usa molt en l'anàlisi de dades futures o plans complexos en l'assaig argumentatiu del C1.",
        timeline: 'future-before-future'
    },
    {
        id: 'conditionnel-present',
        nameFR: 'Le Conditionnel Présent',
        nameCA: 'El Condicional Present',
        usage: 'Desitjos, hipòtesis, consells o cortesia.',
        formation: 'Arrel del futur simple + terminacions de l\'imperfet (<span>-ais, -ais, -ait, -ions, -iez, -aient</span>).',
        examples: [
            { fr: "Je voudrais un café, s'il vous plaît.", ca: "Voldria un cafè, si us plau." },
            { fr: "Si j'avais de l'argent, je voyagerais.", ca: "Si tingués diners, viatjaria." },
            { fr: "Tu devrais étudier plus.", ca: "Hauries d'estudiar més." }
        ],
        c1tip: "Importantíssim el 'conditionnel journalistique' per parlar d'informació no confirmada (Ex: 'Le président serait en fuite').",
        timeline: 'hypothetical-present'
    },
    {
        id: 'conditionnel-passe',
        nameFR: 'Le Conditionnel Passé',
        nameCA: 'El Condicional Passat',
        usage: 'Laments, retrets o hipòtesis sobre el passat que no es van complir.',
        formation: 'Auxiliar <span>être</span> o <span>avoir</span> al condicional present + participi passat.',
        examples: [
            { fr: "J'aurais aimé te voir.", ca: "M'hauria agradat veure't." },
            { fr: "Si j'avais su, je ne serais pas venu.", ca: "Si hagués sabut, no hauria vingut." },
            { fr: "Tu aurais pu me le dire !", ca: "M'ho hauries pogut dir!" }
        ],
        c1tip: "Estructura clau: 'Si + plus-que-parfait -> conditionnel passé'. Un clàssic dels exercicis de gramàtica C1.",
        timeline: 'hypothetical-past'
    },
    {
        id: 'subjonctif-present',
        nameFR: 'Le Subjonctif Présent',
        nameCA: 'El Subjuntiu Present',
        usage: 'Expressa dubte, desig, emoció, necessitat o judici subjetiu.',
        formation: 'Arrel de la 3a persona del plural del present + <span>-e, -es, -e, -ions, -iez, -ent</span>.',
        examples: [
            { fr: "Il faut que tu fasses tes devoirs.", ca: "Cal que facis els deures." },
            { fr: "Je doute qu'il vienne.", ca: "Dubto que vingui." },
            { fr: "Bien qu'il soit fatigué, il travaille.", ca: "Encara que estigui cansat, treballa." }
        ],
        c1tip: "Al C1 s'exigeix el domini de conjuncions complexes que regeixen el subjuntiu: 'pourvu que', 'à moins que' (sovint amb 'ne' expletiu).",
        timeline: 'subjective-present'
    },
    {
        id: 'subjonctif-passe',
        nameFR: 'Le Subjonctif Passé',
        nameCA: 'El Subjuntiu Passat',
        usage: 'Acció subjetiva acabada en el passat.',
        formation: 'Auxiliar <span>être</span> o <span>avoir</span> al subjuntiu present + participi passat.',
        examples: [
            { fr: "Je suis content que tu aies réussi.", ca: "Estic content que hagis aprovat." },
            { fr: "Il est dommage qu'elle soit partie si tôt.", ca: "És una llàstima que hagi marxat tan d'hora." },
            { fr: "Bien qu'il ait neigé, la route est ouverte.", ca: "Tot i que ha nevat, la carretera està oberta." }
        ],
        c1tip: "S'utilitza per marcar l'anterioritat dins de la subordinada quan el verb principal demana subjuntiu.",
        timeline: 'subjective-past'
    },
    {
        id: 'gerondif',
        nameFR: 'Le Gérondif',
        nameCA: 'El Gerundi',
        usage: 'Simultaneïtat, causa o manera.',
        formation: '<span>en</span> + participi present (arrel nous al present + <span>-ant</span>).',
        examples: [
            { fr: "Il chante en cuisinant.", ca: "Canta mentre cuina." },
            { fr: "En étudiant, on apprend.", ca: "Estudiant, s'aprèn." },
            { fr: "Tout en sachant la vérité, il s'est tu.", ca: "Tot i sabent la veritat, va callar." }
        ],
        c1tip: "L'ús de 'tout' davant del gerundi reforça la idea de concessió o oposició ('Tout en étant...', 'Tot i sent...').",
        timeline: 'simultaneous'
    },
    {
        id: 'infinitif-passe',
        nameFR: 'L\'Infinitif Passé',
        nameCA: 'L\'Infinitiu Passat',
        usage: 'Acció acabada abans de l\'acció principal.',
        formation: 'Auxiliar <span>être</span> o <span>avoir</span> a l\'infinitiu + participi passat.',
        examples: [
            { fr: "Après avoir mangé, il est parti.", ca: "Després d'haver menjat, va marxar." },
            { fr: "Je vous remercie d'être venus.", ca: "Us agraeixo haver vingut." },
            { fr: "Sans avoir lu le livre, il ne peut pas comprendre.", ca: "Sense haver llegit el llibre, no pot entendre." }
        ],
        c1tip: "Molt comú en les estructures amb 'Après' i per expressar agraïment o penediment formal.",
        timeline: 'past-infinitive'
    }
];

const COMMON_VERBS = [
    {
        verb: 'Être',
        regular: false,
        topC1: true,
        conjugations: {
            present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
            imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
            passeCompose: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
            futur: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
            subjonctif: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient']
        }
    },
    {
        verb: 'Avoir',
        regular: false,
        topC1: true,
        conjugations: {
            present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
            imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
            passeCompose: ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu'],
            futur: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
            subjonctif: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient']
        }
    },
    {
        verb: 'Faire',
        regular: false,
        topC1: true,
        conjugations: {
            present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
            imparfait: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
            passeCompose: ['ai fait', 'as fait', 'a fait', 'avons fait', 'avez fait', 'ont fait'],
            futur: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
            subjonctif: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent']
        }
    }
];

const C1_SPECIAL = {
    topErrors: [
        { title: "Confondre l'Imparfait et le Passé Composé", desc: "L'imperfet és per a descripcions i hàbits; el passat compost per a accions acabades." },
        { title: "Le 'Ne' explétif", desc: "S'utilitza després de verbs de por o certes conjuncions (à moins que, avant que) sense valor negatiu." },
        { title: "L'accord du participe passé avec 'Avoir'", desc: "Obligatori si el COD va davant del verb." },
        { title: "Le subjonctif après 'Bien que' vs 'Malgré'", desc: "Bien que + subjonctif; Malgré + nom." }
    ],
    concordanceTemps: [
        { main: "Present / Futur", subordinate: "Present / Passat Compost", example: "Je pense qu'il viendra." },
        { main: "Passat (Imparfait, PC)", subordinate: "Imparfait / Plus-que-parfait / Conditionnel", example: "Je pensais qu'il viendrait." }
    ],
    discoursIndirect: [
        { direct: "Présent", indirect: "Imparfait", example: '"Je mange" -> Il a dit qu\'il mangeait.' },
        { direct: "Passé Composé", indirect: "Plus-que-parfait", example: '"J\'ai fini" -> Il a dit qu\'il avait fini.' },
        { direct: "Futur Simple", indirect: "Conditionnel Présent", example: '"Je viendrai" -> Il a dit qu\'il viendrait.' }
    ]
};

const FLASHCARDS = [
    { prompt: "Si j'avais su, je ne ________ pas venu.", answer: "serais", tense: "Conditionnel Présent", explanation: "Condicional present amb 'être' — estructura clau: Si + plus-que-parfait → conditionnel présent." },
    { prompt: "Il faut que tu ________ tes devoirs. (faire)", answer: "fasses", tense: "Subjonctif Présent", explanation: "Subjuntiu present de 'faire' — 'Il faut que' sempre demana subjuntiu." },
    { prompt: "Bien qu'il ________ fatigué, il travaille. (être)", answer: "soit", tense: "Subjonctif Présent", explanation: "Subjuntiu present de 'être' — 'Bien que' sempre va amb subjuntiu." },
    { prompt: "Après ________ mangé, il est parti. (avoir)", answer: "avoir", tense: "Infinitif Passé", explanation: "Infinitiu passat — Après + avoir/être + participi passat." },
    { prompt: "Je doute qu'il ________ demain. (venir)", answer: "vienne", tense: "Subjonctif Présent", explanation: "Subjuntiu present de 'venir' — 'douter que' demana subjuntiu." },
    { prompt: "Si j'________ de l'argent, je voyagerais. (avoir)", answer: "avais", tense: "Imparfait", explanation: "Imperfet — estructura: Si + imparfait → conditionnel présent." },
    { prompt: "Il ________ en 1900. (naître – passé simple)", answer: "naquit", tense: "Passé Simple", explanation: "Passat simple de 'naître' — temps literari per a accions puntuals en narrativa escrita." },
    { prompt: "Nous ________ déjà mangé quand tu es arrivé. (avoir)", answer: "avions", tense: "Plus-que-parfait", explanation: "Plusquamperfet — auxiliar 'avoir' a l'imperfet + participi passat. Marca anterioritat." },
    { prompt: "Je voudrais que vous ________ attention. (faire)", answer: "fassiez", tense: "Subjonctif Présent", explanation: "Subjuntiu present de 'faire' (2a persona plural) — 'vouloir que' demana subjuntiu." },
    { prompt: "Tout en ________ la vérité, il s'est tu. (savoir)", answer: "sachant", tense: "Gérondif", explanation: "Gerundi — 'Tout en + participi present' expressa concessió: 'tot i sabent'." },
    { prompt: "Quand tu arriveras, nous ________ déjà mangé. (avoir)", answer: "aurons", tense: "Futur Antérieur", explanation: "Futur anterior — auxiliar 'avoir' al futur simple. Marca anterioritat futura." },
    { prompt: "Je suis content que tu ________ réussi. (avoir)", answer: "aies", tense: "Subjonctif Passé", explanation: "Subjuntiu passat — auxiliar 'avoir' al subjuntiu present. 'Être content que' demana subjuntiu." }
];

const PRACTICE_EXERCISES = [
    // --- ACADÈMIC / FORMAL ---
    {
        id: 'ex-01',
        prompt: "Si le gouvernement (prendre) ________ ces mesures plus tôt, la crise aurait été évitée.",
        answer: "avait pris",
        answerAlt: [],
        tense: "Plus-que-parfait",
        explanation: "Hipòtesi sobre el passat: Si + Plus-que-parfait → Conditionnel passé. 'Prendre' → participi 'pris'.",
        context: "Hypothèse sur le passé (Si + Plus-que-parfait)",
        type: "Acadèmic",
        difficulty: 2
    },
    {
        id: 'ex-02',
        prompt: "Bien qu'il (faire) ________ preuve de bonne volonté, son projet a été rejeté.",
        answer: "ait fait",
        answerAlt: [],
        tense: "Subjonctif Passé",
        explanation: "Concessió: 'Bien que' sempre demana subjuntiu passat aquí perquè l'acció és anterior al rebuig.",
        context: "Concession (Bien que + Subjonctif)",
        type: "Formal",
        difficulty: 2
    },
    {
        id: 'ex-03',
        prompt: "Il est impératif que vous (soumettre) ________ votre rapport avant lundi.",
        answer: "soumettiez",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Necessitat: 'Il est impératif que' demana subjuntiu present. Conjugació de 'soumettre' com 'mettre'.",
        context: "Nécessité (Il est impératif que + Subjonctif)",
        type: "Professional",
        difficulty: 2
    },
    {
        id: 'ex-04',
        prompt: "Après (analyser) ________ les données, nous avons conclu à une erreur.",
        answer: "avoir analysé",
        answerAlt: [],
        tense: "Infinitif Passé",
        explanation: "Anterioritat: 'Après' + infinitiu passat (avoir/être + participi). Acció acabada abans de la principal.",
        context: "Antériorité (Après + Infinitif Passé)",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-05',
        prompt: "Le témoin a affirmé qu'il (voir) ________ l'accusé quitter les lieux.",
        answer: "avait vu",
        answerAlt: [],
        tense: "Plus-que-parfait",
        explanation: "Discurs indirecte: Passé composé → Plus-que-parfait quan el verb introductori és en passat.",
        context: "Discours Indirect (Passé -> Plus-que-parfait)",
        type: "Jurídic",
        difficulty: 2
    },
    // --- PREMSA ---
    {
        id: 'ex-06',
        prompt: "Selon certaines sources, le PDG (donner) ________ sa démission ce soir.",
        answer: "donnerait",
        answerAlt: [],
        tense: "Conditionnel Présent",
        explanation: "Condicional periodístic: s'usa per a informació no confirmada. Típic de la premsa francesa.",
        context: "Conditionnel Journalistique",
        type: "Premsa",
        difficulty: 1
    },
    {
        id: 'ex-07',
        prompt: "Une fois que la loi (être) ________ votée, elle entrera en vigueur.",
        answer: "aura été",
        answerAlt: [],
        tense: "Futur Antérieur",
        explanation: "Futur anterior passiu: 'Une fois que' + futur antérieur marca anterioritat futura.",
        context: "Futur Antérieur (Action future achevée)",
        type: "Premsa",
        difficulty: 3
    },
    {
        id: 'ex-08',
        prompt: "Les manifestants (occuper) ________ la place depuis déjà trois jours quand la police est intervenue.",
        answer: "occupaient",
        answerAlt: [],
        tense: "Imparfait",
        explanation: "Imperfet: acció en curs quan succeeix una altra acció puntual (policia intervé = passé composé).",
        context: "Description d'une action en cours (Imparfait)",
        type: "Premsa",
        difficulty: 1
    },
    // --- GRAMÀTICA C1 AVANÇADA ---
    {
        id: 'ex-09',
        prompt: "Je ne pense pas que ce scénario (pouvoir) ________ se réaliser.",
        answer: "puisse",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Opinió negativa: 'Ne pas penser que' demana subjuntiu present. 'Pouvoir' → 'puisse'.",
        context: "Opinion négative (Ne pas penser que + Subjonctif)",
        type: "Debat",
        difficulty: 2
    },
    {
        id: 'ex-10',
        prompt: "Il se peut que nous (devoir) ________ revoir nos objectifs.",
        answer: "devions",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Possibilitat: 'Il se peut que' demana subjuntiu present. 'Devoir' → 'devions' (nous).",
        context: "Possibilité (Il se peut que + Subjonctif)",
        type: "Professional",
        difficulty: 2
    },
    {
        id: 'ex-11',
        prompt: "Je regrette que tu ne (venir) ________ pas à la conférence hier.",
        answer: "sois venu",
        answerAlt: ["sois venue"],
        tense: "Subjonctif Passé",
        explanation: "Subjuntiu passat: 'Regretter que' + acció passada = subjonctif passé. 'Venir' usa auxiliar 'être'.",
        context: "Regret sur le passé (Subjonctif Passé)",
        type: "Formal",
        difficulty: 3
    },
    {
        id: 'ex-12',
        prompt: "À moins que vous n' (avoir) ________ une meilleure idée, nous suivrons ce plan.",
        answer: "ayez",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Condició: 'À moins que' demana subjuntiu + 'ne' expletiu (sense valor negatiu).",
        context: "Condition (À moins que + Subjonctif + Ne explétif)",
        type: "Professional",
        difficulty: 2
    },
    {
        id: 'ex-13',
        prompt: "Quoi que vous (dire) ________, il ne changera pas d'avis.",
        answer: "disiez",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Concessió: 'Quoi que' sempre va amb subjuntiu present. 'Dire' → 'disiez' (vous).",
        context: "Concession (Quoi que + Subjonctif)",
        type: "Debat",
        difficulty: 2
    },
    // --- LITERARI ---
    {
        id: 'ex-14',
        prompt: "D'un geste brusque, il (fermer) ________ la porte et disparut.",
        answer: "ferma",
        answerAlt: [],
        tense: "Passé Simple",
        explanation: "Passat simple: temps literari per a accions puntuals en narrativa. 'Fermer' → '-a' (1r grup).",
        context: "Action soudaine (Passé Simple)",
        type: "Literari",
        difficulty: 2
    },
    {
        id: 'ex-15',
        prompt: "Ils (s'apercevoir) ________ bientôt de leur méprise.",
        answer: "s'aperçurent",
        answerAlt: [],
        tense: "Passé Simple",
        explanation: "Passat simple de 's'apercevoir' — verb del 3r grup amb arrel irregular '-çurent'.",
        context: "Récit (Passé Simple)",
        type: "Literari",
        difficulty: 3
    },
    // --- CONCORDANÇA COMPLEXA ---
    {
        id: 'ex-16',
        prompt: "Si j'avais su que tu (être) ________ là, je t'aurais appelé.",
        answer: "étais",
        answerAlt: [],
        tense: "Imparfait",
        explanation: "Concordança en subordinada: el verb de la completiva al passat segueix la concordança → imperfet.",
        context: "Concordance dans la complétive au passé",
        type: "Conversa Formal",
        difficulty: 2
    },
    {
        id: 'ex-17',
        prompt: "Il aurait fallu que nous (anticiper) ________ les risques.",
        answer: "anticipions",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Necessitat al passat: condicional passat + 'que' demana subjuntiu present (imperfet del subjuntiu en estil elevat).",
        context: "Nécessité au passé (Conditionnel Passé + Subjonctif)",
        type: "Professional",
        difficulty: 3
    },
    {
        id: 'ex-18',
        prompt: "Dès qu'il (terminer) ________ son discours, la foule l'acclama.",
        answer: "eut terminé",
        answerAlt: [],
        tense: "Passé Antérieur",
        explanation: "Passat anterior: anterioritat immediata en relació amb el passat simple. 'Dès que' + passé antérieur.",
        context: "Antériorité immédiate au passé simple (Passé Antérieur)",
        type: "Literari",
        difficulty: 3
    },
    // --- MÉS EXERCICIS ---
    {
        id: 'ex-19',
        prompt: "Nous espérons que vous (recevoir) ________ notre colis dans les brefs délais.",
        answer: "recevrez",
        answerAlt: [],
        tense: "Futur Simple",
        explanation: "Esperança futura: 'Espérer que' va amb indicatiu (no subjuntiu!). Futur simple de 'recevoir'.",
        context: "Espoir futur (Indicatif)",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-20',
        prompt: "Au cas où il y (avoir) ________ un problème, n'hésitez pas à nous contacter.",
        answer: "aurait",
        answerAlt: [],
        tense: "Conditionnel Présent",
        explanation: "Condició: 'Au cas où' sempre va amb condicional present. Mai amb subjuntiu!",
        context: "Condition (Au cas où + Conditionnel)",
        type: "Professional",
        difficulty: 2
    },
    {
        id: 'ex-21',
        prompt: "Je ne crois pas qu'il (faire) ________ le bon choix lors de la réunion.",
        answer: "ait fait",
        answerAlt: [],
        tense: "Subjonctif Passé",
        explanation: "Creença negativa sobre el passat: 'Ne pas croire que' + acció passada = subjonctif passé.",
        context: "Croyance négative sur le passé (Subjonctif Passé)",
        type: "Professional",
        difficulty: 2
    },
    {
        id: 'ex-22',
        prompt: "Pourvu qu'il (arriver) ________ à temps pour la présentation !",
        answer: "arrive",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Desig: 'Pourvu que' demana subjuntiu present. Expressa un desig o esperança.",
        context: "Souhait (Pourvu que + Subjonctif)",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-23',
        prompt: "Il est rare qu'un candidat (réussir) ________ cet examen du premier coup.",
        answer: "réussisse",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Judici: 'Il est rare que' demana subjuntiu present. 'Réussir' → 'réussisse'.",
        context: "Jugement (Il est rare que + Subjonctif)",
        type: "Acadèmic",
        difficulty: 2
    },
    {
        id: 'ex-24',
        prompt: "Nous (vivre) ________ à Paris depuis 10 ans quand nous avons décidé de déménager.",
        answer: "vivions",
        answerAlt: [],
        tense: "Imparfait",
        explanation: "Durada en el passat: imperfet per a una acció en curs quan arriba una altra acció puntual.",
        context: "Durée dans le passé",
        type: "Relat",
        difficulty: 1
    },
    {
        id: 'ex-25',
        prompt: "Si tu (vouloir) ________, nous pourrions en discuter plus tard.",
        answer: "voulais",
        answerAlt: [],
        tense: "Imparfait",
        explanation: "Hipòtesi present: Si + imperfet → condicional present. 'Vouloir' → 'voulais'.",
        context: "Hypothèse (Si + Imparfait -> Conditionnel)",
        type: "Formal",
        difficulty: 1
    },
    {
        id: 'ex-26',
        prompt: "En (prendre) ________ le train, vous éviterez les bouchons.",
        answer: "prenant",
        answerAlt: [],
        tense: "Gérondif",
        explanation: "Gerundi: 'En' + participi present. Expressa el mitjà o la manera. 'Prendre' → 'prenant'.",
        context: "Moyen (Gérondif)",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-27',
        prompt: "C'est le meilleur film que j' (voir) ________ cette année.",
        answer: "aie vu",
        answerAlt: [],
        tense: "Subjonctif Passé",
        explanation: "Superlatiu: després d'un superlatiu ('le meilleur que'), s'usa el subjuntiu passat.",
        context: "Superlatif (Subjonctif)",
        type: "Cultura",
        difficulty: 2
    },
    {
        id: 'ex-28',
        prompt: "Il se peut qu'il (oublier) ________ notre rendez-vous.",
        answer: "ait oublié",
        answerAlt: [],
        tense: "Subjonctif Passé",
        explanation: "Possibilitat passada: 'Il se peut que' + acció passada = subjonctif passé.",
        context: "Possibilité passée (Subjonctif Passé)",
        type: "Formal",
        difficulty: 2
    },
    {
        id: 'ex-29',
        prompt: "Quoi qu'il (arriver) ________, restez calmes.",
        answer: "arrive",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Concessió: 'Quoi que' + subjuntiu present. 'Arriver' → 'arrive' (il).",
        context: "Concession",
        type: "Instruccions",
        difficulty: 1
    },
    {
        id: 'ex-30',
        prompt: "Je cherche quelqu'un qui (pouvoir) ________ m'aider.",
        answer: "puisse",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Recerca d'una persona amb qualitat no confirmada: la subordinada relativa va amb subjuntiu.",
        context: "Recherche d'une personne avec caractéristique précise",
        type: "Professional",
        difficulty: 2
    },
    {
        id: 'ex-31',
        prompt: "Il (pleuvoir) ________ à torrents quand soudain le vent se calma.",
        answer: "pleuvait",
        answerAlt: [],
        tense: "Imparfait",
        explanation: "Imperfet: descripció del rerefons (pluja) quan succeeix una acció puntual (vent que es calma).",
        context: "Arrière-plan (Imparfait)",
        type: "Relat",
        difficulty: 1
    },
    {
        id: 'ex-32',
        prompt: "Dès que j' (avoir) ________ les résultats, je vous préviendrai.",
        answer: "aurai",
        answerAlt: [],
        tense: "Futur Simple",
        explanation: "Futur anterioritzat: 'Dès que' + futur simple (o futur antérieur). Aquí futur simple per simultaneïtat.",
        context: "Simultanéité future",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-33',
        prompt: "Si j' (être) ________ toi, je ne ferais pas ça.",
        answer: "étais",
        answerAlt: [],
        tense: "Imparfait",
        explanation: "Consell: 'Si j'étais toi' — estructura clàssica amb imperfet per donar consells.",
        context: "Conseil (Si + Imparfait)",
        type: "Formal",
        difficulty: 1
    },
    {
        id: 'ex-34',
        prompt: "Bien qu'il (être) ________ tard, il continuait à travailler.",
        answer: "soit",
        answerAlt: ["fût"],
        tense: "Subjonctif Présent",
        explanation: "Concessió: 'Bien que' + subjuntiu present. ('Fût' és acceptable en registre literari.)",
        context: "Concession",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-35',
        prompt: "Nous (finir) ________ le projet avant la fin de la semaine.",
        answer: "finirons",
        answerAlt: [],
        tense: "Futur Simple",
        explanation: "Futur simple: acció futura. 'Finir' → arrel 'finir-' + '-ons'.",
        context: "Futur simple",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-36',
        prompt: "Il faut que vous (faire) ________ attention aux détails.",
        answer: "fassiez",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "Necessitat: 'Il faut que' + subjuntiu present. 'Faire' → 'fassiez' (vous).",
        context: "Subjonctif present",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-37',
        prompt: "J' (aimer) ________ beaucoup ce voyage l'année dernière.",
        answer: "ai aimé",
        answerAlt: [],
        tense: "Passé Composé",
        explanation: "Passat compost: acció acabada en el passat. 'Aimer' + auxiliar 'avoir'.",
        context: "Passé composé",
        type: "Relat",
        difficulty: 1
    },
    {
        id: 'ex-38',
        prompt: "Quand nous (arriver) ________, la réunion avait déjà commencé.",
        answer: "sommes arrivés",
        answerAlt: ["sommes arrivées"],
        tense: "Passé Composé",
        explanation: "Passat compost amb 'être': 'arriver' usa 'être'. L'acord en gènere depèn del subjecte.",
        context: "Antériorité",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-39',
        prompt: "Si vous (avoir) ________ besoin de quelque chose, dites-le nous.",
        answer: "avez",
        answerAlt: [],
        tense: "Présent",
        explanation: "Condició real (present): 'Si' + present indicatiu per a condicions reals/probables.",
        context: "Condition réelle",
        type: "Professional",
        difficulty: 1
    },
    {
        id: 'ex-40',
        prompt: "Avant que tu (partir) ________, signe ce document.",
        answer: "partes",
        answerAlt: [],
        tense: "Subjonctif Présent",
        explanation: "'Avant que' sempre demana subjuntiu present. Sovint amb 'ne' expletiu opcional.",
        context: "Avant que + subjonctif",
        type: "Professional",
        difficulty: 1
    }
];
