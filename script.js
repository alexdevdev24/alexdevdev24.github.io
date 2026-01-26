document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentIndex = 0;
    // Store user answers: { questionIndex: "optionValue" }
    // Initialize with 'blank' or null? let's say null implies not visited, but default is often 'blank' in exams.
    // Let's rely on explicit selection.
    let userAnswers = new Array(examData.length).fill(null);

    // DOM Elements
    const container = document.getElementById('quiz-container');
    const controlsArea = document.getElementById('controls-area'); // We'll inject buttons here
    const hudScore = document.getElementById('hud-score');
    const hudCorrect = document.getElementById('hud-correct');
    const hudIncorrect = document.getElementById('hud-incorrect');

    // Start
    initQuiz();

    function initQuiz() {
        currentIndex = 0;
        // Reset answers
        userAnswers = new Array(examData.length).fill('blank'); // Default to blank? Or let them choose?
        // Actually, "Dejar en blanco" is usually an explicit choice. Let's default to 'blank' so score starts at 0 (blanks don't penalize).
        // Wait, if default is blank, User hasn't "unlocked" the question. 
        // Let's initialize as 'blank' so the logic is consistent.

        calculateGlobalScore();
        loadQuestion(currentIndex);
    }

    function calculateGlobalScore() {
        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let blankCount = 0;

        userAnswers.forEach((val, idx) => {
            const correctVal = String(examData[idx].answer);

            if (!val || val === 'blank') {
                blankCount++;
                // No points
            } else if (val === correctVal) {
                score += 3;
                correctCount++;
            } else {
                score -= 1;
                incorrectCount++;
            }
        });

        // Update HUD
        hudScore.innerText = score;
        hudCorrect.innerText = correctCount;
        hudIncorrect.innerText = incorrectCount;
    }

    function loadQuestion(index) {
        if (index < 0 || index >= examData.length) return;

        const q = examData[index];

        // --- Render UI ---
        // Images
        let imagesHtml = '';
        if (q.images && q.images.length > 0) {
            imagesHtml = `<div class="q-image">`;
            q.images.forEach(img => {
                imagesHtml += `<img src="../images/${img}" alt="Imagen">`;
            });
            imagesHtml += `</div>`;
        }

        // Options
        let optionsHtml = '';
        ['1', '2', '3', '4'].forEach(optNum => {
            if (q.options && q.options[optNum]) {
                const isSelected = userAnswers[index] === optNum ? 'checked' : '';
                const selectedClass = userAnswers[index] === optNum ? 'selected' : '';

                optionsHtml += `
                    <label class="option-label ${selectedClass}" data-opt="${optNum}">
                        <input type="radio" name="current-q" value="${optNum}" ${isSelected}>
                        <span class="option-text"><strong>${optNum})</strong> ${q.options[optNum]}</span>
                    </label>
                `;
            }
        });

        // Blank Option
        const blankSelected = (userAnswers[index] === 'blank' || userAnswers[index] === null) ? 'checked' : '';
        const blankClass = (userAnswers[index] === 'blank' || userAnswers[index] === null) ? 'selected' : ''; // Optional visual style for blank?

        optionsHtml += `
            <label class="option-label blank-option ${blankClass}" data-opt="blank">
                <input type="radio" name="current-q" value="blank" ${blankSelected}>
                <span class="option-text">Dejar en blanco (No contestada)</span>
            </label>
        `;

        const html = `
            <div class="question-card">
                <div class="question-header">
                    <span class="q-num">PREGUNTA ${q.number} / ${examData.length}</span>
                    <span class="q-status" id="q-status">SELECCIONE RESPUESTA</span>
                </div>
                ${imagesHtml}
                <div class="q-text">${q.text}</div>
                <div class="options-grid">
                    ${optionsHtml}
                </div>
                <!-- NO EXPLANATION BOX HERE -->
                <div style="margin-top: 15px; text-align: right;">
                    <button class="btn-clean" id="btn-ask-ai" style="font-size: 0.8rem; color: var(--accent-color); background: transparent; border: 1px solid var(--border-color); padding: 5px 10px; cursor: pointer; border-radius: 4px;">
                        🤖 PREGUNTAR A IA (ChatGPT)
                    </button>
                    <div id="copy-toast" style="display:none; color: var(--neon-green); font-size: 0.8rem; margin-top: 5px;">¡Texto copiado! Pégalo en el chat.</div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        updateControls(index);

        // --- Event Listeners ---

        // Ask AI Listener
        document.getElementById('btn-ask-ai').addEventListener('click', (e) => {
            e.preventDefault();
            const promptText = `Actúa como un profesor experto en medicina (preparación MIR). Analiza la siguiente pregunta, explica cada opción y razona cuál es la correcta:\n\n` +
                `ENUNCIADO: ${q.text}\n\n` +
                `OPCIONES:\n` +
                ['1', '2', '3', '4'].map(opt => q.options && q.options[opt] ? `${opt}) ${q.options[opt]}` : '').filter(Boolean).join('\n') +
                `\n\nExplica brevemente la fisiopatología asociada.`;

            navigator.clipboard.writeText(promptText).then(() => {
                const toast = document.getElementById('copy-toast');
                toast.style.display = 'block';
                setTimeout(() => toast.style.display = 'none', 3000);

                // Open ChatGPT (Universal link)
                window.open('https://chatgpt.com/', '_blank');
            });
        });

        container.querySelectorAll('.option-label').forEach(label => {
            label.addEventListener('click', function () {
                // Visual selection only
                container.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                this.classList.add('selected');

                // Select radio
                const radio = this.querySelector('input');
                radio.checked = true;

                // DATA UPDATE
                const val = radio.value;
                userAnswers[index] = val;

                // Immediate Score Update
                calculateGlobalScore();
            });
        });
    }

    function updateControls(index) {
        // Clear previous buttons
        controlsArea.innerHTML = '';

        // Previous Button
        if (index > 0) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn-futuristic';
            prevBtn.innerText = '<<< ANTERIOR';
            prevBtn.style.marginRight = '10px';
            prevBtn.onclick = () => {
                currentIndex--;
                loadQuestion(currentIndex);
            };
            controlsArea.appendChild(prevBtn);
        }

        // Next/Finish Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-futuristic';

        if (index === examData.length - 1) {
            nextBtn.innerText = 'FINALIZAR SIMULACIÓN';
            nextBtn.onclick = showSummary;
        } else {
            nextBtn.innerText = 'SIGUIENTE >>>';
            nextBtn.onclick = () => {
                currentIndex++;
                loadQuestion(currentIndex);
            };
        }
        controlsArea.appendChild(nextBtn);
    }

    function showSummary() {
        // Calculate final stats one last time
        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let blankCount = 0;

        userAnswers.forEach((val, idx) => {
            const correctVal = String(examData[idx].answer);
            if (!val || val === 'blank') {
                blankCount++;
            } else if (val === correctVal) {
                score += 3;
                correctCount++;
            } else {
                score -= 1;
                incorrectCount++;
            }
        });

        // Maybe show list of wrong answers? 
        // For now, simpler summary as per request "corrigé d'exam final"

        container.innerHTML = `
            <div class="summary-screen">
                <h2>RESULTADOS FINALES</h2>
                <div class="final-score">${score} Puntos</div>
                <div class="stats-grid">
                    <p>Aciertos: <strong style="color:var(--neon-green)">${correctCount}</strong></p>
                    <p>Fallos: <strong style="color:var(--neon-red)">${incorrectCount}</strong></p>
                    <p>Blancos: <strong>${blankCount}</strong></p>
                </div>
                <div style="margin-top: 30px;">
                    <p>Para ver el detalle de respuestas correctas, reinicie el sistema o consulte el PDF oficial.</p>
                </div>
                <button class="btn-futuristic" onclick="location.reload()">REINICIAR</button>
            </div>
        `;
        controlsArea.innerHTML = '';
    }
});
