document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const calculateBtn = document.getElementById('calculate-btn');
    const scoreSummary = document.getElementById('score-summary');

    // Render Questions
    examData.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `q-card-${q.number}`;

        // Handle images
        let imagesHtml = '';
        if (q.images && q.images.length > 0) {
            imagesHtml = `<div class="q-image">`;
            q.images.forEach(img => {
                // Assuming images are in ../images/ relative to the site folder
                imagesHtml += `<img src="../images/${img}" alt="Imagen pregunta ${q.number}">`;
            });
            imagesHtml += `</div>`;
        }

        // Handle Options
        let optionsHtml = '';
        // Some questions might have options as object or array. Standardize.
        // The JSON seems to have "options": {"1": "...", "2": "..."}

        ['1', '2', '3', '4'].forEach(optNum => {
            if (q.options && q.options[optNum]) {
                optionsHtml += `
                    <label class="option-label" data-q="${q.number}" data-opt="${optNum}">
                        <input type="radio" name="q${q.number}" value="${optNum}">
                        <span class="option-text"><strong>${optNum})</strong> ${q.options[optNum]}</span>
                    </label>
                `;
            }
        });

        // Blank option
        optionsHtml += `
            <label class="option-label blank-option" data-q="${q.number}" data-opt="blank">
                <input type="radio" name="q${q.number}" value="blank" checked>
                <span class="option-text">Dejar en blanco (No contestada)</span>
            </label>
        `;

        card.innerHTML = `
            <div class="question-header">
                <span class="q-num">Pregunta ${q.number}</span>
                <span class="q-status" id="status-${q.number}"></span>
            </div>
            ${imagesHtml}
            <div class="q-text">${q.text}</div>
            <div class="options-grid">
                ${optionsHtml}
            </div>
            <div class="explanation-box" id="explain-${q.number}">
                <span class="explanation-title">Explicación:</span>
                ${q.explanation || "Sin explicación disponible."}
                <br><br>
                <strong>Respuesta Correcta: ${q.answer}</strong>
            </div>
        `;

        container.appendChild(card);
    });

    // Add click listeners to highlight selection
    document.querySelectorAll('.option-label').forEach(label => {
        label.addEventListener('click', function () {
            // Remove selected class from siblings
            const parent = this.parentNode;
            parent.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
        });
        // Initial check for default (blank) is not styled "selected" to keep it clean
    });

    // Calculate Results
    calculateBtn.addEventListener('click', () => {
        let correct = 0;
        let incorrect = 0;
        let blank = 0;
        let totalScore = 0;

        examData.forEach(q => {
            const selected = document.querySelector(`input[name="q${q.number}"]:checked`);
            const val = selected ? selected.value : 'blank';
            const card = document.getElementById(`q-card-${q.number}`);
            const explanation = document.getElementById(`explain-${q.number}`);
            const statusLabel = document.getElementById(`status-${q.number}`);

            // Reset styles
            card.classList.remove('correct', 'incorrect');
            card.querySelectorAll('.option-label').forEach(l => {
                l.classList.remove('is-correct-answer', 'is-wrong-selection');
            });

            // Show explanation
            explanation.style.display = 'block';

            // Highlight Correct Answer
            const correcyOptLabel = card.querySelector(`.option-label[data-opt="${q.answer}"]`);
            if (correcyOptLabel) correcyOptLabel.classList.add('is-correct-answer');

            if (val === 'blank') {
                blank++;
                statusLabel.innerText = 'NO CONTESTADA';
                statusLabel.style.color = 'gray';
                statusLabel.style.display = 'inline-block';
            } else if (parseInt(val) === parseInt(q.answer)) {
                correct++;
                totalScore += 3;
                card.classList.add('correct');
                statusLabel.innerText = 'CORRECTA (+3)';
                statusLabel.style.display = 'inline-block';
            } else {
                incorrect++;
                totalScore -= 1;
                card.classList.add('incorrect');
                statusLabel.innerText = 'INCORRECTA (-1)';
                statusLabel.style.display = 'inline-block';

                // Highlight user's wrong selection
                const selectedLabel = card.querySelector(`.option-label[data-opt="${val}"]`);
                if (selectedLabel) selectedLabel.classList.add('is-wrong-selection');
            }
        });

        // Update Summary
        document.getElementById('total-score').innerText = totalScore;
        document.getElementById('correct-count').innerText = correct;
        document.getElementById('incorrect-count').innerText = incorrect;
        document.getElementById('blank-count').innerText = blank;

        scoreSummary.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
