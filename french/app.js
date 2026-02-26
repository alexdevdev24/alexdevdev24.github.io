/**
 * French-Catalan Comparative App Logic
 * Focused on Strategic Language Bridges for DALF C1
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const state = {
    currentSection: 'matrix-verbs'
};

function initApp() {
    setupNavigation();
    renderSection(state.currentSection);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('data-section');
            navigateTo(section);
        });
    });

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

    document.querySelectorAll('.nav-links li').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-section') === section);
    });

    document.querySelectorAll('.bottom-nav-item').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-section') === section);
    });

    renderSection(section);
}

function renderSection(sectionId) {
    const contentArea = document.getElementById('content-area');
    const sectionTitle = document.getElementById('section-title');

    contentArea.innerHTML = '';
    contentArea.classList.remove('fade-in');
    void contentArea.offsetWidth;
    contentArea.classList.add('fade-in');

    switch (sectionId) {
        case 'matrix-verbs':
            sectionTitle.innerText = 'Matrice des Verbes';
            renderVerbsMatrix(contentArea);
            break;
        case 'matrix-connectors':
            sectionTitle.innerText = 'Connecteurs Logiques';
            renderConnectorsMatrix(contentArea);
            break;
        case 'matrix-interferences':
            sectionTitle.innerText = 'Ponts & Interférences';
            renderInterferencesMatrix(contentArea);
            break;
    }
}

function renderVerbsMatrix(container) {
    let html = `<div class="matrix-grid">`;
    COMPARATIVE_MATRIX.tenses.forEach(tense => {
        html += `
            <div class="card matrix-card">
                <div class="matrix-header">
                    <span class="fr-label">${tense.fr}</span>
                    <span class="matrix-arrow">↔</span>
                    <span class="ca-label">${tense.ca}</span>
                </div>
                <div class="matrix-body">
                    <p class="usage-text"><strong>Usage :</strong> ${tense.usage}</p>
                    <div class="c1-note">
                        <strong>💡 Focus C1 :</strong> ${tense.nuanceC1}
                    </div>
                    <div class="interference-note">
                        <strong>⚠️ Nuance CA-FR :</strong> ${tense.interference}
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}

function renderConnectorsMatrix(container) {
    let html = '';
    COMPARATIVE_MATRIX.connectors.forEach(cat => {
        html += `
            <div class="card" style="margin-bottom: 2rem;">
                <h3 class="card-title" style="color: var(--accent-gold);">${cat.category}</h3>
                <div class="connectors-table-container">
                    <table class="connectors-table">
                        <thead>
                            <tr>
                                <th>Français</th>
                                <th>Català</th>
                                <th>Note d'usage</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cat.items.map(item => `
                                <tr>
                                    <td class="fr-cell">${item.fr}</td>
                                    <td class="ca-cell">${item.ca}</td>
                                    <td class="note-cell">${item.use}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderInterferencesMatrix(container) {
    let html = `<div class="interferences-grid">`;
    COMPARATIVE_MATRIX.interferences.forEach(item => {
        html += `
            <div class="card info-card">
                <h3 class="card-title">${item.title}</h3>
                <p class="desc-text">${item.description}</p>
                <div class="examples-box">
                    ${item.examples.map(ex => `
                        <div class="example-item">
                            <div class="ex-fr">🇫🇷 ${ex.fr}</div>
                            <div class="ex-ca">➡️ ${ex.ca}</div>
                            <div class="ex-note">${ex.note}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}
