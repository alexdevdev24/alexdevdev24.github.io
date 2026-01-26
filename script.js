document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentIndex = 0;
    // Store user answers: { questionIndex: "optionValue" }
    let userAnswers = new Array(examData.length).fill(null);
    let isLocked = false; // Prevent clicks during auto-advance delay

    // DOM Elements
    const container = document.getElementById('quiz-container');
    const controlsArea = document.getElementById('controls-area');
    const hudScore = document.getElementById('hud-score');
    const hudCorrect = document.getElementById('hud-correct');
    const hudIncorrect = document.getElementById('hud-incorrect');

    // Start
    initQuiz();

    function initQuiz() {
        currentIndex = 0;
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
        isLocked = false; // Unlock for new question

        const q = examData[index];
        const correctVal = String(q.answer);

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

        // Determine if we should show results immediately (if already answered)
        const currentAnswer = userAnswers[index];

        let optionsHtml = '';
        ['1', '2', '3', '4'].forEach(optNum => {
            if (q.options && q.options[optNum]) {
                let extraClass = '';
                let isChecked = '';

                // If already answered, show the state
                if (currentAnswer) {
                    if (currentAnswer === optNum) isChecked = 'checked';

                    // Visual Feedback Logic
                    if (currentAnswer === optNum) {
                        extraClass = (optNum === correctVal) ? 'correct-answer' : 'wrong-selection selected';
                    }
                    if (optNum === correctVal && currentAnswer !== 'blank') {
                        extraClass += ' correct-answer';
                    }
                }

                optionsHtml += `
                    <label class="option-label ${extraClass}" data-opt="${optNum}">
                        <input type="radio" name="current-q" value="${optNum}" ${isChecked}>
                        <span class="option-text"><strong>${optNum})</strong> ${q.options[optNum]}</span>
                    </label>
                `;
            }
        });

        // Blank Option
        const blankSelected = (currentAnswer === 'blank') ? 'checked' : '';
        optionsHtml += `
            <label class="option-label blank-option" data-opt="blank">
                <input type="radio" name="current-q" value="blank" ${blankSelected}>
                <span class="option-text">Dejar en blanco (No contestada)</span>
            </label>
        `;

        const html = `
            <div class="question-card">
                <div class="question-header">
                    <span class="q-num">PREGUNTA ${q.number} / ${examData[examData.length - 1].number}</span>
                    <span class="q-status" id="q-status">SELECCIONE (AUTO-AVANCE)</span>
                </div>
                ${imagesHtml}
                <div class="q-text">${q.text}</div>
                <div class="options-grid">
                    ${optionsHtml}
                </div>
                
                <div style="margin-top: 15px; text-align: right;">
                    <button class="btn-clean" id="btn-ask-ai" style="font-size: 0.8rem; color: var(--accent-color); background: transparent; border: 1px solid var(--border-color); padding: 5px 10px; cursor: pointer; border-radius: 4px;">
                        🤖 PREGUNTAR A IA (ChatGPT)
                    </button>
                    <div id="copy-toast" style="display:none; color: var(--neon-green); font-size: 0.8rem; margin-top: 5px;">¡Copiado!</div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        updateControls(index);

        // --- Event Listeners ---

        // Ask AI
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
                window.open('https://chatgpt.com/', '_blank');
            });
        });

        // Selection Logic
        container.querySelectorAll('.option-label').forEach(label => {
            label.addEventListener('click', function (e) {
                if (isLocked) return; // Ignore clicks during transition

                const radio = this.querySelector('input');
                const val = radio.value;

                // If already selected the same thing, do nothing? 
                // No, user might want to re-trigger? 
                // Let's assume clicking locks it in.

                isLocked = true; // Lock immediately
                userAnswers[index] = val;

                // --- Visual Updates ---
                // 1. Remove old classes
                container.querySelectorAll('.option-label').forEach(l => {
                    l.classList.remove('selected', 'correct-answer', 'wrong-selection');
                });

                // 2. Add visual feedback
                const correctVal = String(examData[index].answer);

                if (val === 'blank') {
                    // Just blank, maybe no color? Or gray?
                    this.classList.add('selected');
                } else {
                    if (val === correctVal) {
                        this.classList.add('correct-answer');
                    } else {
                        this.classList.add('wrong-selection');
                        // Highlight real correct answer too
                        const correctLabel = container.querySelector(`.option-label[data-opt="${correctVal}"]`);
                        if (correctLabel) correctLabel.classList.add('correct-answer');
                    }
                }

                radio.checked = true;

                // 3. Update Score
                calculateGlobalScore();

                // 4. Auto Advance
                if (index < examData.length - 1) {
                    setTimeout(() => {
                        currentIndex++;
                        loadQuestion(currentIndex);
                    }, 1200); // 1.2 seconds delay
                } else {
                    // Last question
                    setTimeout(() => showSummary(), 1200);
                }
            });
        });
    }

    function updateControls(index) {
        controlsArea.innerHTML = '';

        // Previous Button
        if (index > 0) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn-futuristic';
            prevBtn.innerText = '<<< ANTERIOR';
            prevBtn.style.marginRight = '10px';
            prevBtn.onclick = () => {
                isLocked = false;
                currentIndex--;
                loadQuestion(currentIndex);
            };
            controlsArea.appendChild(prevBtn);
        }

        // Manual Next (in case they want to skip without answering or review)
        if (index < examData.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn-futuristic';
            nextBtn.innerText = 'SIGUIENTE >>>';
            nextBtn.onclick = () => {
                isLocked = false;
                currentIndex++;
                loadQuestion(currentIndex);
            };
            controlsArea.appendChild(nextBtn);
        } else {
            const finishBtn = document.createElement('button');
            finishBtn.className = 'btn-futuristic';
            finishBtn.innerText = 'FINALIZAR';
            finishBtn.onclick = showSummary;
            controlsArea.appendChild(finishBtn);
        }
    }

    function showSummary() {
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

        container.innerHTML = `
            <div class="summary-screen">
                <h2>RESULTADOS FINALES</h2>
                <div class="final-score">${score} Puntos</div>
                <div class="stats-grid">
                    <p>Aciertos: <strong style="color:var(--neon-green)">${correctCount}</strong></p>
                    <p>Fallos: <strong style="color:var(--neon-red)">${incorrectCount}</strong></p>
                    <p>Blancos: <strong>${blankCount}</strong></p>
                </div>
                <button class="btn-futuristic" onclick="location.reload()">REINICIAR</button>
            </div>
        `;
        controlsArea.innerHTML = '';
    }
});
