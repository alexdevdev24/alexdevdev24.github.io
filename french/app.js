/**
 * French Verb Tenses App Logic — Duolingo-Style Refonte
 * UI Language: Catalan
 * Features: SRS, Session (5/10/20), Flexible answer comparison, Streak calendar, Real weak points
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// =================== STATE ===================
const state = {
    currentSection: 'dashboard',
    masteredTenses: JSON.parse(localStorage.getItem('masteredTenses')) || [],
    streak: parseInt(localStorage.getItem('streak')) || 0,
    lastVisit: localStorage.getItem('lastVisit') || null,
    visitHistory: JSON.parse(localStorage.getItem('visitHistory')) || [],
    // SRS: map of exerciseId -> { score, lastSeen }
    srsData: JSON.parse(localStorage.getItem('srsData')) || {},
    // Wrong answers tracker: exerciseId -> count
    wrongAnswers: JSON.parse(localStorage.getItem('wrongAnswers')) || {}
};

function initApp() {
    checkStreak();
    updateGlobalProgress();
    window.renderSection(state.currentSection);
    setupNavigation();
}

// =================== NAVIGATION ===================

function setupNavigation() {
    // Desktop sidebar nav
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('data-section');
            navigateTo(section);
        });
    });

    // Mobile bottom nav
    const bottomItems = document.querySelectorAll('.bottom-nav-item');
    bottomItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            navigateTo(section);
        });
    });
}

function navigateTo(section) {
    if (section === state.currentSection) return;
    state.currentSection = section;

    // Sync sidebar active
    document.querySelectorAll('.nav-links li').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-section') === section);
    });

    // Sync bottom nav active
    document.querySelectorAll('.bottom-nav-item').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-section') === section);
    });

    // Hide session bar when navigating away
    showSessionBar(false);

    window.renderSection(section);
}

// =================== RENDER ROUTER ===================

window.renderSection = function(sectionId) {
    const contentArea = document.getElementById('content-area');
    const sectionTitle = document.getElementById('section-title');

    contentArea.innerHTML = '';
    contentArea.classList.remove('fade-in');
    void contentArea.offsetWidth;
    contentArea.classList.add('fade-in');

    switch (sectionId) {
        case 'dashboard':
            sectionTitle.innerText = 'Dashboard';
            renderDashboard(contentArea);
            break;
        case 'learn':
            sectionTitle.innerText = 'Aprèn els Temps';
            renderLearn(contentArea);
            break;
        case 'explorer':
            sectionTitle.innerText = 'Explorador de Conjugació';
            renderExplorer(contentArea);
            break;
        case 'flashcards':
            sectionTitle.innerText = 'Memoritza';
            renderFlashcards(contentArea);
            break;
        case 'quiz':
            sectionTitle.innerText = 'Pràctica';
            renderQuiz(contentArea);
            break;
        case 'c1-special':
            sectionTitle.innerText = 'Nivell C1 DALF';
            renderC1Special(contentArea);
            break;
    }
};

// =================== DASHBOARD ===================

function renderDashboard(container) {
    const progress = Math.round((state.masteredTenses.length / TENSES_DATA.length) * 100);

    container.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <h3 class="card-title">📈 Progrés</h3>
                <p>${state.masteredTenses.length} de ${TENSES_DATA.length} temps dominats</p>
                <div class="progress-bar" style="margin-top: 1rem;">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div style="text-align: center; margin-top: 1rem;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: ${progress > 80 ? 'var(--accent-green)' : 'var(--accent-gold)'}">${progress}%</div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${getReadinessText(progress)}</p>
                </div>
            </div>
            <div class="card">
                <h3 class="card-title">🔥 Racha Diària</h3>
                <p style="font-size: 2.2rem; font-weight: 700; text-align: center; margin: 0.5rem 0;">🔥 ${state.streak} Dies</p>
                ${renderStreakCalendar()}
            </div>
        </div>
        <div class="card" style="margin-top: 1.5rem;">
            <h3 class="card-title">🎯 Punts febles a revisar</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Basat en els teus exercicis.</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${renderWeakPoints()}
            </div>
        </div>
    `;
}

function renderStreakCalendar() {
    const today = new Date();
    const dayNames = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];
    let html = '<div class="streak-calendar">';
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toDateString();
        const isToday = i === 0;
        const isDone = state.visitHistory.includes(dateStr);
        const dayIdx = (d.getDay() + 6) % 7; // Monday=0
        const classes = ['streak-day'];
        if (isDone) classes.push('done');
        if (isToday) classes.push('today');
        html += `<div class="${classes.join(' ')}">${dayNames[dayIdx]}</div>`;
    }
    html += '</div>';
    return html;
}

function renderWeakPoints() {
    const sorted = Object.entries(state.wrongAnswers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sorted.length === 0) {
        return '<span style="color: var(--text-muted);">Encara no hi ha dades. Fes exercicis per veure els teus punts febles!</span>';
    }

    return sorted.map(([exId, count]) => {
        const ex = PRACTICE_EXERCISES.find(e => e.id === exId);
        if (!ex) return '';
        return `<span class="weak-badge" title="${count} errors">${ex.context} (${count}×)</span>`;
    }).join('');
}

// =================== LEARN ===================

function renderLearn(container) {
    let html = '<div class="tenses-list">';
    TENSES_DATA.forEach(tense => {
        const isMastered = state.masteredTenses.includes(tense.id);
        html += `
            <div class="card" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                    <div>
                        <h3 style="color: var(--accent-gold); font-size: 1.3rem;">${tense.nameFR}</h3>
                        <h4 style="color: var(--text-secondary); font-size: 0.95rem;">${tense.nameCA}</h4>
                    </div>
                    <button class="mastery-toggle ${isMastered ? 'mastered' : ''}" onclick="window.toggleMastery('${tense.id}')">
                        ${isMastered ? '✅ Dominat' : '⭕ Marcar'}
                    </button>
                </div>
                <div class="tense-content-grid" style="margin-top: 1.2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div>
                        <p><strong>Ús:</strong> ${tense.usage}</p>
                        <p style="margin-top: 0.8rem;"><strong>Formació:</strong> ${tense.formation}</p>
                    </div>
                    <div>
                        <strong>Exemples:</strong>
                        <ul style="list-style: none; margin-top: 0.5rem;">
                            ${tense.examples.map(ex => `<li style="margin-bottom: 0.5rem;">🇫🇷 ${ex.fr}<br><span style="color: var(--text-secondary); font-size: 0.85rem;">➡️ ${ex.ca}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding: 0.8rem 1rem; background: var(--accent-blue-light); border-left: 4px solid var(--accent-blue); border-radius: 4px; font-size: 0.9rem;">
                    <strong>💡 Consell C1:</strong> ${tense.c1tip}
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// =================== EXPLORER ===================

function renderExplorer(container) {
    container.innerHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.8rem;">
                <input type="text" id="verb-search" class="quiz-input" placeholder="Cerca un verb (ex: Faire)..." style="flex-grow: 1;">
                <button class="btn-primary" onclick="window.searchVerb()">Cerca</button>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 0.8rem; color: var(--text-secondary);">Destacats:</span>
                ${COMMON_VERBS.map(v => `<button class="chip" onclick="window.showVerb('${v.verb}')">${v.verb}</button>`).join('')}
            </div>
        </div>
        <div id="search-result">
            <p style="text-align: center; color: var(--text-secondary); margin-top: 3rem;">Cerca un dels verbs destacats o introdueix-ne un.</p>
        </div>
    `;
}

window.showVerb = function(verbName) {
    const verb = COMMON_VERBS.find(v => v.verb === verbName);
    const resultDiv = document.getElementById('search-result');
    if (!verb) return;

    resultDiv.innerHTML = `
        <div class="card fade-in">
            <h3 style="color: var(--accent-gold); font-size: 1.8rem; margin-bottom: 0.5rem;">${verb.verb}</h3>
            <p style="margin-bottom: 1.5rem;">${verb.regular ? '🟢 Regular' : '🔴 Irregular'} ${verb.topC1 ? '| ⭐ Indispensable C1' : ''}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                ${Object.entries(verb.conjugations).map(([tense, forms]) => `
                    <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md);">
                        <h4 style="text-transform: capitalize; margin-bottom: 0.5rem; color: var(--accent-blue); font-size: 0.9rem;">${tense}</h4>
                        <ul style="list-style: none; font-size: 0.85rem;">
                            ${forms.map((f, i) => `<li><span style="color: var(--text-muted);">${['je', 'tu', 'il', 'nous', 'vous', 'ils'][i]}</span> ${f}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

window.searchVerb = function() {
    const queryInput = document.getElementById('verb-search');
    if (!queryInput) return;
    const query = queryInput.value.toLowerCase().trim();
    const verb = COMMON_VERBS.find(v => v.verb.toLowerCase() === query);
    if (verb) {
        window.showVerb(verb.verb);
    } else {
        document.getElementById('search-result').innerHTML = `<p style="text-align: center; color: var(--accent-red); margin-top: 2rem;">Ho sentim, el verb "${query}" no és a la nostra base de dades C1 encara.</p>`;
    }
};

// =================== FLASHCARDS ===================

// Track selected tense filter for flashcards
let flashcardTenseFilter = null;

function getFlashcardTenses() {
    return [...new Set(FLASHCARDS.map(f => f.tense))].sort();
}

function renderFlashcards(container) {
    const allTenses = getFlashcardTenses();
    const filtered = flashcardTenseFilter
        ? FLASHCARDS.filter(f => f.tense === flashcardTenseFilter)
        : FLASHCARDS;
    const queue = getSRSQueue(filtered.map((f, i) => ({ ...f, id: 'fc-' + i })));
    const card = queue[0] || filtered[0];

    container.innerHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.8rem; color: var(--text-secondary); font-size: 0.9rem;">🎯 Filtra per temps:</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="chip ${!flashcardTenseFilter ? 'active-chip' : ''}" onclick="window.setFlashcardFilter(null)">Tots</button>
                ${allTenses.map(t => `<button class="chip ${flashcardTenseFilter === t ? 'active-chip' : ''}" onclick="window.setFlashcardFilter('${t}')">${t}</button>`).join('')}
            </div>
        </div>
        <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
            <div style="margin-bottom: 1rem;">
                <span class="badge" style="background: var(--accent-blue); color: white; font-size: 0.8rem;">🕐 ${card.tense}</span>
            </div>
            <h3 style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 1rem;">Completa la frase:</h3>
            <p style="font-size: 1.3rem; font-weight: 500; line-height: 1.8;">${card.prompt}</p>
            <div style="margin-top: 2rem;">
                <input type="text" id="flashcard-input" class="quiz-input" placeholder="Escriu la resposta..." style="text-align: center; font-size: 16px;" autocomplete="off">
                <button id="fc-submit" class="btn-primary btn-gold" style="width: 100%; margin-top: 1rem;" onclick="window.checkFlashcard()">Comprova</button>
            </div>
            <div id="flashcard-feedback" class="hidden" style="margin-top: 1.5rem;"></div>
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
            <button class="btn-ghost" onclick="window.renderSection('flashcards')">Següent frase ➡️</button>
        </div>
    `;

    // Store current card data
    container._currentCard = card;

    // Focus & enter key
    const input = document.getElementById('flashcard-input');
    input.focus();
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('fc-submit').click();
    });
}

window.setFlashcardFilter = function(tense) {
    flashcardTenseFilter = tense;
    window.renderSection('flashcards');
};

window.checkFlashcard = function() {
    const container = document.getElementById('content-area');
    const card = container._currentCard;
    const input = document.getElementById('flashcard-input');
    const feedback = document.getElementById('flashcard-feedback');
    const isCorrect = checkAnswer(input.value, card.answer, []);

    feedback.classList.remove('hidden');
    input.classList.add(isCorrect ? 'correct' : 'incorrect');
    input.disabled = true;

    if (isCorrect) {
        input.classList.add('anim-bounce');
        feedback.className = 'feedback-box correct';
        feedback.innerHTML = `<h4 style="color: var(--accent-green);">Molt bé! ✨</h4><p class="rule">${card.explanation}</p>`;
    } else {
        input.classList.add('anim-shake');
        feedback.className = 'feedback-box incorrect';
        feedback.innerHTML = `<h4 style="color: var(--accent-red);">Incorrecte</h4><p>La resposta era: <strong>${card.answer}</strong></p><p class="rule">${card.explanation}</p>`;
    }

    // Update SRS
    if (card.id) updateSRS(card.id, isCorrect);

    // Change button to next
    const btn = document.getElementById('fc-submit');
    btn.innerText = 'Següent ➡️';
    btn.className = 'btn-primary';
    btn.onclick = () => window.renderSection('flashcards');
};

// =================== QUIZ (SESSION) ===================

let quizTenseFilter = null;

function getExerciseTenses() {
    return [...new Set(PRACTICE_EXERCISES.map(e => e.tense))].sort();
}

function renderQuiz(container) {
    const allTenses = getExerciseTenses();
    const filtered = quizTenseFilter
        ? PRACTICE_EXERCISES.filter(e => e.tense === quizTenseFilter)
        : PRACTICE_EXERCISES;
    const availableCount = filtered.length;

    container.innerHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.8rem; color: var(--text-secondary); font-size: 0.9rem;">🎯 Filtra per temps:</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="chip ${!quizTenseFilter ? 'active-chip' : ''}" onclick="window.setQuizFilter(null)">Tots (${PRACTICE_EXERCISES.length})</button>
                ${allTenses.map(t => {
                    const c = PRACTICE_EXERCISES.filter(e => e.tense === t).length;
                    return `<button class="chip ${quizTenseFilter === t ? 'active-chip' : ''}" onclick="window.setQuizFilter('${t}')">${t} (${c})</button>`;
                }).join('')}
            </div>
        </div>
        <div class="card" style="text-align: center; padding: 2rem 1.5rem;">
            <h3 style="font-size: 1.8rem; margin-bottom: 0.8rem; color: var(--accent-gold);">Pràctica C1</h3>
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 1rem;">
                ${quizTenseFilter ? '📌 ' + quizTenseFilter : 'Tots els temps'} — ${availableCount} exercicis disponibles
            </p>
            <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 0.85rem;">
                Producció real sense opcions. Tria quantes preguntes vols fer.
            </p>
            <div class="session-selector">
                <button class="session-option" onclick="window.startQuiz(5)" ${availableCount < 5 ? 'disabled style="opacity:0.4;pointer-events:none"' : ''}>
                    5
                    <span class="label">Ràpid</span>
                </button>
                <button class="session-option" onclick="window.startQuiz(10)" ${availableCount < 10 ? 'disabled style="opacity:0.4;pointer-events:none"' : ''}>
                    10
                    <span class="label">Normal</span>
                </button>
                <button class="session-option" onclick="window.startQuiz(${Math.min(20, availableCount)})">
                    ${Math.min(20, availableCount)}
                    <span class="label">${availableCount <= 20 ? 'Tot' : 'Intensiu'}</span>
                </button>
            </div>
        </div>
    `;
}

window.setQuizFilter = function(tense) {
    quizTenseFilter = tense;
    window.renderSection('quiz');
};

window.startQuiz = function(count) {
    let currentQ = 0;
    let score = 0;
    const container = document.getElementById('content-area');

    // Filter by selected tense, then SRS sort
    const pool = quizTenseFilter
        ? PRACTICE_EXERCISES.filter(e => e.tense === quizTenseFilter)
        : PRACTICE_EXERCISES;
    const queue = getSRSQueue(pool);
    const exercises = queue.slice(0, count);

    showSessionBar(true);
    updateSessionBar(0, exercises.length);

    function showQuestion() {
        if (currentQ >= exercises.length) {
            showResult();
            return;
        }
        const q = exercises[currentQ];
        updateSessionBar(currentQ, exercises.length);

        container.innerHTML = `
            <div class="card fade-in" style="max-width: 700px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Exercici ${currentQ + 1} de ${exercises.length}</span>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <span class="badge" style="background: var(--accent-gold); color: var(--bg-primary);">🕐 ${q.tense}</span>
                        <span class="badge" style="background: var(--accent-blue); color: white;">${q.type}</span>
                    </div>
                </div>
                <h3 style="margin-bottom: 1.5rem; line-height: 1.7; font-size: 1.2rem;">${q.prompt}</h3>
                <div style="margin-top: 1.5rem;">
                    <input type="text" id="quiz-input" class="quiz-input" placeholder="Escriu la forma verbal..." autocomplete="off">
                    <div id="quiz-feedback" class="hidden" style="margin-top: 1rem;"></div>
                    <button id="quiz-submit" class="btn-primary btn-gold" style="width: 100%; margin-top: 1rem;">Comprova</button>
                </div>
                <p style="margin-top: 1.2rem; color: var(--text-muted); font-size: 0.85rem;"><strong>Context:</strong> ${q.context}</p>
            </div>
        `;

        const input = document.getElementById('quiz-input');
        const submit = document.getElementById('quiz-submit');
        const feedback = document.getElementById('quiz-feedback');

        input.focus();
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit.click();
        });

        submit.onclick = () => {
            const isCorrect = checkAnswer(input.value, q.answer, q.answerAlt || []);

            if (isCorrect) score++;

            // Update SRS and wrong answers
            updateSRS(q.id, isCorrect);
            if (!isCorrect) {
                state.wrongAnswers[q.id] = (state.wrongAnswers[q.id] || 0) + 1;
                localStorage.setItem('wrongAnswers', JSON.stringify(state.wrongAnswers));
            }

            // Show feedback
            feedback.classList.remove('hidden');
            input.disabled = true;
            input.classList.add(isCorrect ? 'correct' : 'incorrect');

            if (isCorrect) {
                input.classList.add('anim-bounce');
                feedback.className = 'feedback-box correct';
                feedback.innerHTML = `
                    <span style="color: var(--accent-green); font-weight: 700;">✓ Correcte!</span>
                    <p class="rule">${q.explanation}</p>
                `;
            } else {
                input.classList.add('anim-shake');
                feedback.className = 'feedback-box incorrect';
                feedback.innerHTML = `
                    <span style="color: var(--accent-red); font-weight: 700;">✗ Incorrecte</span>
                    <p>La resposta era: <strong>${q.answer}</strong></p>
                    <p class="rule">${q.explanation}</p>
                `;
            }

            submit.innerText = 'Següent';
            submit.className = 'btn-primary';
            submit.onclick = () => {
                currentQ++;
                showQuestion();
            };
        };
    }

    function showResult() {
        showSessionBar(false);
        const percent = Math.round((score / exercises.length) * 100);
        container.innerHTML = `
            <div class="card fade-in" style="text-align: center; max-width: 500px; margin: 0 auto;">
                <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">${percent >= 80 ? 'Excel·lent! 🎓' : percent >= 50 ? 'Bon intent! 💪' : 'Continua practicant! 📚'}</h2>
                <p style="font-size: 1.3rem; margin-bottom: 1.5rem;">Has encertat <strong>${score} de ${exercises.length}</strong> (${percent}%)</p>
                <div style="background: var(--bg-tertiary); padding: 1.2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <p>${getReadinessText(percent)}</p>
                </div>
                <button class="btn-primary btn-gold" onclick="window.renderSection('quiz')" style="font-size: 1.1rem;">Torna-ho a provar</button>
            </div>
        `;
        if (percent >= 80) triggerConfetti();
    }

    showQuestion();
};

// =================== C1 SPECIAL ===================

function renderC1Special(container) {
    container.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <div class="card">
                <h3 class="card-title">📖 Top 10 Errors al C1</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    ${C1_SPECIAL.topErrors.map(err => `
                        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md);">
                            <strong style="color: var(--accent-red);">${err.title}</strong>
                            <p style="font-size: 0.85rem; margin-top: 0.5rem;">${err.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <h3 class="card-title">🔄 Concordança de Temps</h3>
                <div class="table-scroll">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                                <th style="padding: 1rem;">Verb Principal</th>
                                <th style="padding: 1rem;">Subordinada</th>
                                <th style="padding: 1rem;">Exemple</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${C1_SPECIAL.concordanceTemps.map(item => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 1rem;">${item.main}</td>
                                    <td style="padding: 1rem;">${item.subordinate}</td>
                                    <td style="padding: 1rem; font-style: italic;">${item.example}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title">🗣️ Discurs Indirecte (Transposició)</h3>
                <div class="table-scroll">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                                <th style="padding: 1rem;">Estil Directe</th>
                                <th style="padding: 1rem;">Estil Indirecte</th>
                                <th style="padding: 1rem;">Exemple</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${C1_SPECIAL.discoursIndirect.map(item => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 1rem;">${item.direct}</td>
                                    <td style="padding: 1rem;">${item.indirect}</td>
                                    <td style="padding: 1rem; font-style: italic;">${item.example}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title">🗞️ Conditionnel Journalistique</h3>
                <p>En el periodisme francès, s'usa el condicional per presentar fets no confirmats com a tals.</p>
                <div style="margin-top: 1rem; padding: 1.2rem; background: #1a1a1a; border-left: 4px solid var(--accent-gold); font-style: italic;">
                    "Selon nos informations, le ministre <strong>démissionnerait</strong> demain."
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">Traducció: "Segons les nostres informacions, el ministre dimitiria demà." (No confirmat)</p>
            </div>
        </div>
    `;
}

// =================== SRS ENGINE ===================

function getSRSQueue(exerciseList) {
    // Score each exercise: lower score = higher priority (needs more practice)
    const scored = exerciseList.map(ex => {
        const data = state.srsData[ex.id] || { score: 0, lastSeen: 0 };
        // Priority = low score + time since last seen
        const timeFactor = (Date.now() - data.lastSeen) / (1000 * 60 * 60); // hours
        const priority = -data.score + (timeFactor * 0.1);
        return { ...ex, _priority: priority };
    });

    // Shuffle first to break ties randomly
    for (let i = scored.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scored[i], scored[j]] = [scored[j], scored[i]];
    }

    // Sort by priority descending (highest priority = most needs practice)
    scored.sort((a, b) => b._priority - a._priority);
    return scored;
}

function updateSRS(exerciseId, correct) {
    if (!exerciseId) return;
    const data = state.srsData[exerciseId] || { score: 0, lastSeen: 0 };
    if (correct) {
        data.score = Math.min(data.score + 1, 10);
    } else {
        data.score = Math.max(data.score - 2, -5);
    }
    data.lastSeen = Date.now();
    state.srsData[exerciseId] = data;
    localStorage.setItem('srsData', JSON.stringify(state.srsData));
}

// =================== ANSWER COMPARISON ===================

function normalizeAnswer(str) {
    return str.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, ' ')
              .trim();
}

function checkAnswer(userInput, correctAnswer, alternatives) {
    const userClean = userInput.trim().toLowerCase();
    const userNorm = normalizeAnswer(userInput);
    const allAnswers = [correctAnswer, ...(alternatives || [])];

    return allAnswers.some(a => {
        // Exact match (with accents)
        if (userClean === a.toLowerCase()) return true;
        // Normalized match (without accents)
        if (userNorm === normalizeAnswer(a)) return true;
        return false;
    });
}

// =================== SESSION BAR ===================

function showSessionBar(show) {
    const bar = document.getElementById('session-progress-bar');
    if (show) {
        bar.classList.remove('hidden');
    } else {
        bar.classList.add('hidden');
    }
}

function updateSessionBar(current, total) {
    const fill = document.getElementById('session-bar-fill');
    const percent = Math.round((current / total) * 100);
    fill.style.width = `${percent}%`;
}

// =================== UTILITIES ===================

window.toggleMastery = function(tenseId) {
    if (state.masteredTenses.includes(tenseId)) {
        state.masteredTenses = state.masteredTenses.filter(id => id !== tenseId);
    } else {
        state.masteredTenses.push(tenseId);
    }
    localStorage.setItem('masteredTenses', JSON.stringify(state.masteredTenses));
    updateGlobalProgress();
    window.renderSection('learn');
};

function updateGlobalProgress() {
    const progress = Math.round((state.masteredTenses.length / TENSES_DATA.length) * 100);
    const fill = document.getElementById('global-progress-fill');
    const text = document.getElementById('global-progress-text');
    if (fill) fill.style.width = `${progress}%`;
    if (text) text.innerText = `${progress}%`;
}

function checkStreak() {
    const today = new Date().toDateString();
    if (state.lastVisit === today) {
        // Already visited today, just update display
        document.getElementById('streak-count').innerText = state.streak;
        return;
    }

    if (state.lastVisit) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (state.lastVisit === yesterday.toDateString()) {
            state.streak++;
        } else {
            state.streak = 1;
        }
    } else {
        state.streak = 1;
    }

    state.lastVisit = today;

    // Update visit history (keep last 30 days)
    if (!state.visitHistory.includes(today)) {
        state.visitHistory.push(today);
        // Prune old entries
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        state.visitHistory = state.visitHistory.filter(d => new Date(d) >= thirtyDaysAgo);
    }

    localStorage.setItem('streak', state.streak);
    localStorage.setItem('lastVisit', today);
    localStorage.setItem('visitHistory', JSON.stringify(state.visitHistory));
    document.getElementById('streak-count').innerText = state.streak;
}

function getReadinessText(progress) {
    if (progress < 20) return "Encara queda molt camí. Som-hi! 💪";
    if (progress < 50) return "Vas pel bon camí, però cal més pràctica.";
    if (progress < 80) return "Gairebé a punt! Repassa els temps literaris.";
    return "Excel·lent! Estàs a nivell d'expert. 🏆";
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; display: flex; justify-content: center; align-items: center; font-size: 4rem;">🎉✨🎊🔥</div>';
    setTimeout(() => container.innerHTML = '', 3000);
}
