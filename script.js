document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentIndex = 0;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let isQuestionActive = false; // true = waiting for answer, false = showing result

    // DOM Elements
    const container = document.getElementById('quiz-container');
    const actionBtn = document.getElementById('action-btn');
    const hudScore = document.getElementById('hud-score');
    const hudCorrect = document.getElementById('hud-correct');
    const hudIncorrect = document.getElementById('hud-incorrect');

    // Initial Start
    actionBtn.onclick = startQuiz;

    function startQuiz() {
        currentIndex = 0;
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        updateHUD();
        loadQuestion(currentIndex);
    }

    function updateHUD() {
        // Animate numbers (simple text update for now)
        hudScore.innerText = score;
        hudCorrect.innerText = correctCount;
        hudIncorrect.innerText = incorrectCount;
    }

    function loadQuestion(index) {
        if (index >= examData.length) {
            showSummary();
            return;
        }

        const q = examData[index];
        isQuestionActive = true;

        // Reset button
        actionBtn.innerText = "VALIDER";
        actionBtn.onclick = validateAnswer;

        // Create Card HTML
        // Handle Images
        let imagesHtml = '';
        if (q.images && q.images.length > 0) {
            imagesHtml = `<div class="q-image">`;
            q.images.forEach(img => {
                imagesHtml += `<img src="../images/${img}" alt="Imagen">`;
            });
            imagesHtml += `</div>`;
        }

        // Handle Options
        let optionsHtml = '';
        ['1', '2', '3', '4'].forEach(optNum => {
            if (q.options && q.options[optNum]) {
                optionsHtml += `
                    <label class="option-label" data-opt="${optNum}">
                        <input type="radio" name="current-q" value="${optNum}">
                        <span class="option-text"><strong>${optNum})</strong> ${q.options[optNum]}</span>
                    </label>
                `;
            }
        });

        // Blank Option
        optionsHtml += `
            <label class="option-label blank-option" data-opt="blank">
                <input type="radio" name="current-q" value="blank">
                <span class="option-text">Dejar en blanco (No contestada)</span>
            </label>
        `;

        const html = `
            <div class="question-card">
                <div class="question-header">
                    <span class="q-num">PREGUNTA ${q.number} / ${examData.length}</span>
                    <span class="q-status" id="q-status">EN CURSO...</span>
                </div>
                ${imagesHtml}
                <div class="q-text">${q.text}</div>
                <div class="options-grid">
                    ${optionsHtml}
                </div>
                <div class="explanation-box" id="explanation-box">
                    <span class="explanation-title">ANÁLISIS</span>
                    <div id="explanation-text">${q.explanation || "Sin explicación."}</div>
                    <div style="margin-top:10px; color:var(--text-color)">
                        Respuesta correcta: <strong>${q.answer}</strong>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Add selection listeners
        container.querySelectorAll('.option-label').forEach(label => {
            label.addEventListener('click', function () {
                if (!isQuestionActive) return; // Locked after answering
                // Visual selection
                container.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                this.classList.add('selected');
                // Check radio
                const radio = this.querySelector('input');
                radio.checked = true;
            });
        });
    }

    function validateAnswer() {
        const selectedRadio = document.querySelector('input[name="current-q"]:checked');
        if (!selectedRadio) {
            alert("Por favor, selecciona una opción o 'Dejar en blanco'.");
            return;
        }

        const val = selectedRadio.value;
        const q = examData[currentIndex];
        const statusSpan = document.getElementById('q-status');
        const explanationBox = document.getElementById('explanation-box');

        // Logic
        const correctVal = String(q.answer);

        if (val === 'blank') {
            statusSpan.innerText = "NO CONTESTADA (0)";
            statusSpan.style.color = "var(--accent-color)";
            // No score change
        } else if (val === correctVal) {
            score += 3;
            correctCount++;
            statusSpan.innerText = "CORRECTA (+3)";
            statusSpan.className = "q-status correct";
            // Highlight
            document.querySelector(`.option-label[data-opt="${val}"]`).classList.add('correct-answer');
        } else {
            score -= 1;
            incorrectCount++;
            statusSpan.innerText = "INCORRECTA (-1)";
            statusSpan.className = "q-status incorrect";
            // Highlight Error
            document.querySelector(`.option-label[data-opt="${val}"]`).classList.add('wrong-selection');
        }

        // Always highlight correct answer at the end
        if (val !== correctVal) {
            const correctLabel = document.querySelector(`.option-label[data-opt="${correctVal}"]`);
            if (correctLabel) correctLabel.classList.add('correct-answer');
        }

        // Update State
        isQuestionActive = false;
        updateHUD();
        explanationBox.style.display = "block";

        // Change Button
        actionBtn.innerText = "SIGUIENTE >>>";
        actionBtn.onclick = () => {
            currentIndex++;
            loadQuestion(currentIndex);
        };
    }

    function showSummary() {
        container.innerHTML = `
            <div class="summary-screen">
                <h2>SIMULACIÓN COMPLETADA</h2>
                <div class="final-score">${score} Puntos</div>
                <div class="stats-grid">
                    <p>Aciertos: <strong style="color:var(--neon-green)">${correctCount}</strong></p>
                    <p>Fallos: <strong style="color:var(--neon-red)">${incorrectCount}</strong></p>
                    <p>Blancos: <strong>${examData.length - correctCount - incorrectCount}</strong></p>
                </div>
                <button class="btn-futuristic" onclick="location.reload()">REINICIAR SISTEMA</button>
            </div>
        `;
        actionBtn.style.display = 'none';
    }
});
