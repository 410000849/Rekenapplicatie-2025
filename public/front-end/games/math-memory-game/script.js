document.addEventListener('DOMContentLoaded', () => {

    // Function to load the common header
    function loadHeader() {
        const placeholder = document.getElementById('common-header-placeholder');
        if (!placeholder) {
            console.error('Header placeholder niet gevonden.');
            return;
        }
        fetch('../header.html') // Relative path from script.js to header.html
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                // Optionally add code here to re-evaluate scripts in the loaded header if needed
            })
            .catch(error => {
                console.error('Fout bij het laden van de header:', error);
                placeholder.innerHTML = '<p>Kon header niet laden.</p>';
            });
    }

    // Load the header when the DOM is ready
    loadHeader();

    // === DOM Elementen ===
    const moeilijkheidsKiezer = document.getElementById('difficulty-selector');
    const spelInhoud = document.getElementById('game-content');
    const somTekstElement = document.getElementById('problem-text');
    const keuzeContainerElement = document.getElementById('choice-container');
    const keuzeKnoppen = {
        a: document.getElementById('choice-a'),
        b: document.getElementById('choice-b'),
        c: document.getElementById('choice-c'),
        d: document.getElementById('choice-d'),
        e: document.getElementById('choice-e')
    };
    const feedbackElement = document.getElementById('feedback');
    const feedbackTekstElement = document.getElementById('feedback-text');
    const feedbackImgSuccess = document.getElementById('feedback-img-success');
    const feedbackImgError = document.getElementById('feedback-img-error');
    const scoreElement = document.getElementById('score'); // Pak het #score element zelf
    const scoreWaardeElement = document.getElementById('score-value');
    const rondeTellerElement = document.getElementById('round-value');
    const timerElement = document.getElementById('timer');
    const timerWaardeElement = document.getElementById('timer-value');
    const eindScherm = document.getElementById('end-screen');
    const eindScoreElement = document.getElementById('final-score');
    const herstartKnop = document.getElementById('restart-btn');


    // === Spel Variabelen ===
    let huidigeSom = null;
    let correctAntwoord = null;
    let antwoordOpties = [];
    let moeilijkheidsgraad = 'easy';
    let score = 0;
    let huidigeRonde = 0;
    const maxRondes = 25;
    let timerIntervalId = null;
    let resterendeTijd = 0;
    let rondeTimeoutId = null;


    // === Moeilijkheidsgraad Instellingen ===
    const instellingen = {
        easy:   { bereik: [1, 10], operaties: ['+'],       tijd: 15, aantalOpties: 3 },
        medium: { bereik: [1, 25], operaties: ['+', '-'],    tijd: 10, aantalOpties: 4 },
        hard:   { bereik: [1, 50], operaties: ['+', '-', '*'], tijd: 7,  aantalOpties: 5 }
    };

    // === Hulpfuncties ===
    function geefWillekeurigGetal(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function schudArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; }
    function stopTimer() { if (timerIntervalId) { clearInterval(timerIntervalId); timerIntervalId = null; } if (timerElement) timerElement.classList.remove('low-time'); }
    function stopRondeTimeout() { if (rondeTimeoutId) { clearTimeout(rondeTimeoutId); rondeTimeoutId = null; } }

    // === Timer Functies ===
    function startTimer() {
        stopTimer();
        const niveauInstellingen = instellingen[moeilijkheidsgraad];
        resterendeTijd = niveauInstellingen.tijd;
        if (!timerWaardeElement || !timerElement) return;
        timerWaardeElement.textContent = resterendeTijd;
        timerElement.classList.remove('low-time');

        timerIntervalId = setInterval(() => {
            resterendeTijd--;
            if (timerWaardeElement) timerWaardeElement.textContent = resterendeTijd;
            if (resterendeTijd <= 3 && resterendeTijd > 0) { if (timerElement) timerElement.classList.add('low-time'); }
            if (resterendeTijd <= 0) { stopTimer(); tijdOp(); }
        }, 1000);
    }

    function tijdOp() {
        Object.values(keuzeKnoppen).forEach(knop => { if(knop) knop.disabled = true; });
        if (feedbackElement && feedbackTekstElement && feedbackImgError && feedbackImgSuccess) {
             feedbackTekstElement.textContent = `Tijd is om! Het was ${correctAntwoord}.`;
             feedbackImgError.style.display = 'block';
             feedbackImgSuccess.style.display = 'none';
             feedbackElement.className = 'error';
        } else { console.error("Feedback elementen niet gevonden in tijdOp"); }
        stopRondeTimeout();
        rondeTimeoutId = setTimeout(startNieuweRonde, 2500);
    }

    // === Spel Logica ===
    function genereerSom() {
         if (!somTekstElement || !keuzeKnoppen.a) { console.error("Elementen missen voor genereerSom"); return; }
        const niveauInstellingen = instellingen[moeilijkheidsgraad];
        const aantalOpties = niveauInstellingen.aantalOpties;
        const [min, max] = niveauInstellingen.bereik;
        const operatie = niveauInstellingen.operaties[geefWillekeurigGetal(0, niveauInstellingen.operaties.length - 1)];
        let num1 = geefWillekeurigGetal(min, max); let num2 = geefWillekeurigGetal(min, max);
        switch (operatie) {
            case '+': correctAntwoord = num1 + num2; huidigeSom = `${num1} + ${num2} = ?`; break;
            case '-': if (num1 < num2) [num1, num2] = [num2, num1]; correctAntwoord = num1 - num2; huidigeSom = `${num1} - ${num2} = ?`; break;
            case '*': num1 = geefWillekeurigGetal(1, 10); num2 = geefWillekeurigGetal(1, 12); correctAntwoord = num1 * num2; huidigeSom = `${num1} × ${num2} = ?`; break;
        }

        // Genereer aantalOpties - 1 unieke foute antwoorden
        let fouteAntwoorden = new Set();
        let attempts = 0;
        const maxAttempts = 100;
        while (fouteAntwoorden.size < aantalOpties - 1 && attempts < maxAttempts) {
            let offset = geefWillekeurigGetal(1, Math.max(5, Math.floor(Math.abs(correctAntwoord) * 0.3) + 1));
            let fout = correctAntwoord + (Math.random() < 0.5 ? offset : -offset);
            // Zorg dat fout antwoord niet gelijk is aan correct antwoord en positief is (indien mogelijk)
            if (fout !== correctAntwoord && fout >= 0 && !fouteAntwoorden.has(fout)) {
                fouteAntwoorden.add(fout);
            }
            attempts++;
        }

        // Fallback als niet genoeg unieke foute antwoorden zijn gevonden
        while (fouteAntwoorden.size < aantalOpties - 1) {
            let fallback = correctAntwoord + geefWillekeurigGetal(1, 10) + fouteAntwoorden.size + 1; // +1 om 0 te vermijden bij size 0
            if (fallback !== correctAntwoord && fallback >= 0 && !fouteAntwoorden.has(fallback)) {
                fouteAntwoorden.add(fallback);
            } else {
                 // Voeg een willekeurig getal toe als laatste redmiddel
                let randomFallback = geefWillekeurigGetal(0, Math.max(correctAntwoord + 10, 20));
                if(randomFallback !== correctAntwoord && !fouteAntwoorden.has(randomFallback)){
                     fouteAntwoorden.add(randomFallback);
                }
                 // Beveiliging tegen oneindige loop (hoewel onwaarschijnlijk)
                 if (fouteAntwoorden.size >= aantalOpties -1) break;
            }
             // Zorg dat we niet vastlopen
            fouteAntwoorden = new Set([...fouteAntwoorden].filter(val => val !== correctAntwoord));
        }

        let opties = schudArray([correctAntwoord, ...fouteAntwoorden]);

        // Bouw antwoordOpties object array
        antwoordOpties = opties.map((waarde, index) => ({
            id: String.fromCharCode(97 + index), // 'a', 'b', 'c', ...
            waarde: waarde
        }));

        // Wijs waarden toe aan knopteksten (tot het aantal benodigde opties)
        Object.entries(keuzeKnoppen).forEach(([id, knop], index) => {
            if (index < aantalOpties && antwoordOpties[index] && knop) {
                knop.textContent = ` ${antwoordOpties[index].waarde} `;
            } else if (knop) {
                knop.textContent = ''; // Maak extra knoppen leeg
            }
        });

        console.log("Correct:", correctAntwoord, "Opties:", antwoordOpties.map(o=>o.waarde));
     }

    function toonSom() { if (somTekstElement) somTekstElement.textContent = huidigeSom; else console.error("somTekstElement niet gevonden voor toonSom"); }
    function toonKeuzes() {
        if (!keuzeContainerElement || !keuzeKnoppen.a) { console.error("Elementen missen voor toonKeuzes"); return; }
        keuzeContainerElement.style.display = 'block'; // Toon de container altijd

        const aantalOpties = instellingen[moeilijkheidsgraad].aantalOpties;

        // Itereer over ALLE knoppen
        Object.entries(keuzeKnoppen).forEach(([id, knop], index) => {
            if (knop) {
                if (index < aantalOpties) {
                    knop.style.display = 'inline-block'; // Of 'block' afhankelijk van je CSS
                    knop.disabled = false;
                } else {
                    knop.style.display = 'none'; // Verberg ongebruikte knoppen
                    knop.disabled = true;
                }
            }
        });
    }

    function verwerkKeuze(event) {
        stopTimer(); stopRondeTimeout();
        if (!feedbackElement || !scoreWaardeElement || !keuzeKnoppen.a || !feedbackTekstElement || !feedbackImgSuccess || !feedbackImgError || !scoreElement) { console.error("Elementen missen voor verwerkKeuze"); return; }

        // Disable alle knoppen direct
        Object.values(keuzeKnoppen).forEach(knop => { if(knop) knop.disabled = true; });

        const gekozenId = event.target.id.split('-')[1]; const gekozenOptie = antwoordOpties.find(opt => opt && opt.id === gekozenId);
         if (!gekozenOptie) { console.error("Gekozen optie niet gevonden:", gekozenId); rondeTimeoutId = setTimeout(startNieuweRonde, 1500); return; }

        if (gekozenOptie.waarde === correctAntwoord) {
            feedbackTekstElement.textContent = "Goed zo!"; // Standaard tekst
            feedbackImgSuccess.style.display = 'block'; feedbackImgError.style.display = 'none'; feedbackElement.className = 'success';
            score++; scoreWaardeElement.textContent = score;
            scoreElement.classList.add('pop'); // Voeg pop class toe
            setTimeout(() => { if (scoreElement) scoreElement.classList.remove('pop'); }, 300); // Verwijder na 300ms
            rondeTimeoutId = setTimeout(startNieuweRonde, 1500);
        } else {
            feedbackTekstElement.textContent = `Helaas! Het was ${correctAntwoord}.`;
            feedbackImgError.style.display = 'block'; feedbackImgSuccess.style.display = 'none'; feedbackElement.className = 'error';
            rondeTimeoutId = setTimeout(startNieuweRonde, 2500);
        }
    }

    function kiesMoeilijkheidsgraad(event) { if (!moeilijkheidsKiezer || !spelInhoud || !eindScherm) { console.error("Elementen missen voor kiesMoeilijkheidsgraad"); return; } moeilijkheidsgraad = event.target.dataset.difficulty; moeilijkheidsKiezer.style.display = 'none'; spelInhoud.style.display = 'block'; eindScherm.style.display = 'none'; resetSpel(); startNieuweRonde(); }
    function resetSpel() { score = 0; huidigeRonde = 0; if(scoreWaardeElement) scoreWaardeElement.textContent = score; stopTimer(); stopRondeTimeout(); }

    function startNieuweRonde() {
         stopTimer(); stopRondeTimeout();
         if(scoreElement) scoreElement.classList.remove('pop'); // Verwijder pop class bij start
         huidigeRonde++; if (huidigeRonde > maxRondes) { toonEindscherm(); return; }
         if(rondeTellerElement) rondeTellerElement.textContent = huidigeRonde;
         if (!feedbackElement || !keuzeContainerElement || !keuzeKnoppen.a || !feedbackTekstElement || !feedbackImgSuccess || !feedbackImgError) { console.error("Elementen missen voor startNieuweRonde"); return; }

        // Disable alle knoppen initieel
        Object.values(keuzeKnoppen).forEach(knop => { if(knop) knop.disabled = true; });

        feedbackTekstElement.textContent = ''; feedbackImgSuccess.style.display = 'none'; feedbackImgError.style.display = 'none'; feedbackElement.className = '';
        // Container verbergen is niet meer nodig, toonKeuzes regelt de knoppen zelf
        // if (keuzeContainerElement) keuzeContainerElement.style.display = 'none';
        genereerSom(); if (huidigeSom !== null) { toonSom(); toonKeuzes(); startTimer(); }
    }

     function toonEindscherm() { stopTimer(); stopRondeTimeout(); if(spelInhoud) spelInhoud.style.display = 'none'; if(eindScoreElement) eindScoreElement.textContent = score; if(eindScherm) eindScherm.style.display = 'block'; }
     function herstartSpel() { if(eindScherm) eindScherm.style.display = 'none'; if(moeilijkheidsKiezer) moeilijkheidsKiezer.style.display = 'block'; }

    // === Event Listeners ===
    if (moeilijkheidsKiezer) { document.querySelectorAll('.difficulty-btn').forEach(button => { button.addEventListener('click', kiesMoeilijkheidsgraad); }); } else { console.error("Kon listeners niet toevoegen: moeilijkheidsKiezer niet gevonden."); }

    // Voeg listeners toe aan ALLE keuze knoppen
    let keuzeKnoppenGevonden = true;
    Object.values(keuzeKnoppen).forEach(button => {
        if (button) {
            button.addEventListener('click', verwerkKeuze);
        } else {
            keuzeKnoppenGevonden = false; // Markeer als er een knop mist (optioneel)
        }
    });
    if (!keuzeKnoppenGevonden) {
         console.warn("Een of meer keuze knoppen (a-e) werden niet gevonden in de DOM.");
    }

    if (herstartKnop) { herstartKnop.addEventListener('click', herstartSpel); } else { console.error("Kon listener niet toevoegen: herstartKnop niet gevonden.");}

    // === Init ===
    console.log("Spel geïnitialiseerd (Dashboard stijl), wacht op niveaukeuze.");

}); // Einde van DOMContentLoaded listener