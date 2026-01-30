document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INTERACTIVE MAP (LEAFLET) ---
    if (document.getElementById('map')) {
        const map = L.map('map').setView([46.5, 6.6], 8); // Centered on Romandie

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Hospital Data
        const hospitals = [
            { name: "HVS (Sion)", coords: [46.229, 7.362], color: "green", desc: "El ganador económico. Estación a pie." },
            { name: "CHUV (Lausanne)", coords: [46.525, 6.643], color: "green", desc: "El ganador logístico. Metro en el hospital." },
            { name: "HUG (Genève)", coords: [46.191, 6.155], color: "green", desc: "El prestigio. Transporte top." },
            { name: "HFR (Fribourg)", coords: [46.794, 7.136], color: "green", desc: "La alternativa. Bus OK. Cuidado: Alemán." },
            { name: "RHNe (Neuchâtel)", coords: [46.996, 6.941], color: "green", desc: "El compromiso. Accesible en autobús." },
            { name: "HRC (Rennaz)", coords: [46.368, 6.919], color: "red", desc: "La trampa. En medio de los campos. Coche OBLIGATORIO." },
            { name: "H-JU (Delémont)", coords: [47.363, 7.342], color: "green", desc: "El exilio. Alojamiento incluido." }
        ];

        hospitals.forEach(h => {
            const iconColor = h.color === 'green' ?
                'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' :
                'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

            const icon = new L.Icon({
                iconUrl: iconColor,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            L.marker(h.coords, { icon: icon }).addTo(map)
                .bindPopup(`<b>${h.name}</b><br>${h.desc}`);
        });
    }


    // --- 2. ACTION PLAN CHECKLIST ---
    const checklistData = [
        {
            phase: "🚨 FASE 0: DOSSIER MEBEKO (URGENTE)",
            items: [
                "1. Rellenar el formulario de solicitud MEBEKO (Reconocimiento del título).",
                "2. Solicitar el 'Certificado de Conformidad' (Directiva 2005/36/CE) al Ministerio de Sanidad (Madrid).",
                "3. Traducir al francés: Título + Certificado de Conformidad.",
                "4. Hacer copias compulsadas ante notario: Pasaporte (Original y Traducción) + Título de Medicina (Original y Traducción) + DNI (Original).",
                "5. Certificado de idioma francés C1 (FIDE / DALF).",
                "6. Enviar todo por correo certificado a Berna (Dirección en el dossier MEBEKO).",
            ]
        },
        {
            phase: "🟨 FASE 2: CONTRATACIÓN Y ALOJAMIENTO (M-1)",
            items: [
                "1. Encontrar trabajo (Ver sección 1) con solicitud MEBEKO en curso y solicitud de alojamiento al hospital.",
                "2. Stock de medicamentos (Ontozry).",
                "3. Carta del neurólogo ('Fit to work' en FR/EN).",
            ]
        },
        {
            phase: "🟩 FASE 3: LA LLEGADA (SEMANA 1)",
            items: [
                "1. Registro de habitantes (Inscripción en la comuna antes de 14 días).",
                "2. Cuenta bancaria (PostFinance/UBS/Neon) + Certificado de domicilio.",
                "3. Seguro médico (LAMal) - Franquicia 315 € + Modelo Telmed/Médico de familia.",
                "4. Neurólogo suizo (Pedir cita para dentro de 1 mes)."
            ]
        },
        {
            phase: "🟦 FASE 4: PAPELEO (MESES 1-3)",
            items: [
                "1. Código GLN/EAN.",
                "2. Afiliación cantonal (Derecho a práctica).",
                "3. Carnet de conducir (Canje en el Servicio de Automóviles)."
            ]
        }
    ];

    const checklistContainer = document.getElementById('checklist-container');

    // Use item text as key for better stability if order changes
    const getStateKey = (text) => `swiss_task_${text.replace(/\s+/g, '_').toLowerCase().substring(0, 50)}`;

    if (checklistContainer) {
        checklistData.forEach((phase, pIndex) => {
            const phaseEl = document.createElement('div');
            phaseEl.className = 'glass-card phase-card';
            phaseEl.style.marginBottom = '2rem';

            const title = document.createElement('h3');
            title.textContent = phase.phase;
            title.style.marginBottom = '1rem';
            phaseEl.appendChild(title);

            phase.items.forEach((item, iIndex) => {
                const storageKey = getStateKey(item);
                const isChecked = localStorage.getItem(storageKey) === 'true';

                const id = `item-${pIndex}-${iIndex}`;
                const row = document.createElement('div');
                row.className = 'checklist-item';
                row.style.display = 'flex';
                row.style.alignItems = 'flex-start';
                row.style.marginBottom = '12px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = id;
                checkbox.checked = isChecked;

                // Style fix for checkbox
                checkbox.style.marginTop = '4px';
                checkbox.style.marginRight = '12px';
                checkbox.style.minWidth = '20px';
                checkbox.style.minHeight = '20px';
                checkbox.style.cursor = 'pointer';
                checkbox.style.accentColor = 'var(--swiss-red)';

                const label = document.createElement('label');
                label.htmlFor = id;
                label.textContent = item;
                label.style.cursor = 'pointer';
                label.style.fontSize = '0.95rem';

                const updateVisuals = (checked) => {
                    label.style.textDecoration = checked ? 'line-through' : 'none';
                    label.style.opacity = checked ? '0.5' : '1';
                };

                updateVisuals(isChecked);

                checkbox.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    localStorage.setItem(storageKey, checked);
                    updateVisuals(checked);
                });

                row.appendChild(checkbox);
                row.appendChild(label);
                phaseEl.appendChild(row);
            });

            checklistContainer.appendChild(phaseEl);
        });
    }

});
