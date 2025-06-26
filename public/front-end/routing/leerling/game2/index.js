document.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const resultContainer = document.getElementById('result-container');

    // Game elements
    const startGameBtn = document.getElementById('start-game-btn');
    const resetBtn = document.getElementById('reset-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const homeBtn = document.getElementById('home-btn');
    const levelBtns = document.querySelectorAll('.level-btn');
    const targetNumberEl = document.getElementById('target-number');
    const cardsContainer = document.getElementById('cards-container');
    const selectedCardsEl = document.getElementById('selected-cards');
    const currentSumEl = document.getElementById('current-sum');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');
    const finalScoreEl = document.getElementById('final-score');
    const correctAnswersEl = document.getElementById('correct-answers');
    const totalQuestionsEl = document.getElementById('total-questions');
    const timerContainer = document.querySelector('.timer-container');
    const timerValueEl = document.getElementById('timer-value');
    const timerFill = document.querySelector('.timer-fill');
    const lootbox = document.querySelector('.lootbox');    // Game state
    let gameStarted = false;
    let currentLevel = 'easy';
    let groupDifficultyLoaded = false;
    let targetNumber = 0;
    let currentCards = [];
    let selectedCards = [];
    let currentSum = 0;
    let score = 0;
    let correctAnswers = 0;
    let totalQuestions = 1;
    let currentQuestion = 0;
    let timerInterval = null;
    let timeRemaining = 0;
    let correctCombination = []; // Store the correct combination of cards
    let easyPoints = 10;
    let mediumPoints = 15;
    let hardPoints = 20;

    // Adaptive difficulty variables for Game 2
    let adaptiveDifficulty = 1; // Start level (1=easy, 2=medium, 3=hard)
    let consecutiveCorrect = 0;
    let consecutiveWrong = 0;

    // Level settings
    const levels = {
        easy: {
            minTarget: 20,
            maxTarget: 100,
            minCardValue: 5,
            maxCardValue: 50,
            numberOfCards: 5,
            timeLimit: 30
        },
        medium: {
            minTarget: 50,
            maxTarget: 200,
            minCardValue: 10,
            maxCardValue: 80,
            numberOfCards: 6,
            timeLimit: 25
        },
        hard: {
            minTarget: 100,
            maxTarget: 500,
            minCardValue: 25,
            maxCardValue: 150,
            numberOfCards: 7,
            timeLimit: 20
        },
        adaptive: {
            minTarget: 20,
            maxTarget: 100,
            minCardValue: 5,
            maxCardValue: 50,
            numberOfCards: 5,
            timeLimit: 30
        }
    };    // Event listeners
    startGameBtn.addEventListener('click', () => {
        if (!groupDifficultyLoaded) {
            alert('Laden van instellingen...');
            return;
        }
        startGame();
    });
    resetBtn.addEventListener('click', resetSelection);
    playAgainBtn.addEventListener('click', returnToStartScreen);
    homeBtn.addEventListener('click', () => {
        window.location.href = '/leerling/home';
    });

    // Level buttons are disabled - difficulty is set by teacher
    levelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            return false;
        });
    });

    // Load group difficulty settings
    async function loadGroupDifficulty() {
        try {
            const response = await fetch('/groep/difficulty');
            const data = await response.json();
            
            if (data.success) {
                currentLevel = data.difficulties.game2_difficulty || 'easy';
                groupDifficultyLoaded = true;
                
                // Update UI to show the set difficulty
                updateLevelButtons();
                showDifficultyMessage();
            } else {
                console.log('No group difficulty found, using default easy mode');
                groupDifficultyLoaded = true;
            }
        } catch (error) {
            console.error('Error loading group difficulty:', error);
            groupDifficultyLoaded = true;
        }
    }

    // Update level buttons to show current difficulty and disable selection
    function updateLevelButtons() {
        levelBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            
            if (btn.dataset.level === currentLevel) {
                btn.classList.add('active');
                btn.style.opacity = '1';
            }
        });
    }

    // Show message about difficulty being set by teacher
    function showDifficultyMessage() {
        const levelContainer = document.querySelector('.level-container');
        const existingMessage = document.getElementById('difficulty-message');
        
        if (!existingMessage) {
            const message = document.createElement('p');
            message.id = 'difficulty-message';
            message.style.fontSize = '14px';
            message.style.color = '#666';
            message.style.marginTop = '10px';
            message.style.textAlign = 'center';
            message.textContent = `Moeilijkheidsgraad ingesteld door je docent: ${getDifficultyDisplayName(currentLevel)}`;
            levelContainer.appendChild(message);
        }
    }

    // Get display name for difficulty
    function getDifficultyDisplayName(level) {
        const names = {
            easy: 'Makkelijk',
            medium: 'Gemiddeld', 
            hard: 'Moeilijk',
            adaptive: 'Adaptief'
        };
        return names[level] || 'Makkelijk';
    }

    // Initialize game - show start screen
    function init() {
        startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        resultContainer.style.display = 'none';
        
        // Load group difficulty when initializing
        loadGroupDifficulty();
    }

    // Return to start screen
    function returnToStartScreen() {
        resultContainer.style.display = 'none';
        startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
    }

    // Game functions
    function startGame() {
        gameStarted = true;
        score = 0;
        correctAnswers = 0;
        currentQuestion = 0;
        updateScore();

        // Reset adaptive difficulty if needed
        if (currentLevel === 'adaptive') {
            adaptiveDifficulty = 1;
            consecutiveCorrect = 0;
            consecutiveWrong = 0;
            updateAdaptiveSettings();
        }

        // Show game container and hide other screens
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        resultContainer.style.display = 'none';

        nextQuestion();
    }

    function nextQuestion() {
        currentQuestion++;
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';

        if (currentQuestion > totalQuestions) {
            endGame();
            return;
        }

        resetSelection();
        generateQuestion();
        startTimer();
    }

    function generateQuestion() {
        const settings = levels[currentLevel];

        // Generate target number
        targetNumber = getRandomNumber(settings.minTarget, settings.maxTarget);
        targetNumberEl.textContent = targetNumber;

        // Generate cards that make it possible to reach the target
        currentCards = generatePossibleCards(settings);

        // Display the cards
        displayCards();
    }

    function generatePossibleCards(settings) {
        const cards = [];
        let sum = 0;
        const cardsNeeded = getRandomNumber(2, 4); // Player will need 2-4 cards to reach target
        correctCombination = []; // Reset correct combination

        // Generate cards that can be summed to reach target
        for (let i = 0; i < cardsNeeded - 1; i++) {
            const maxValue = targetNumber - sum - settings.minCardValue; // Ensure we can still add at least one more card
            const value = getRandomNumber(settings.minCardValue, Math.min(maxValue, settings.maxCardValue));
            cards.push(value);
            correctCombination.push(value); // Add to correct combination
            sum += value;
        }

        // Add the final card to reach the target exactly
        cards.push(targetNumber - sum);
        correctCombination.push(targetNumber - sum); // Add final card to correct combination

        // Add distractor cards
        while (cards.length < settings.numberOfCards) {
            const value = getRandomNumber(settings.minCardValue, settings.maxCardValue);
            // Don't add cards that would make it too easy or duplicate values
            if (value !== targetNumber && !cards.includes(value) && value + sum !== targetNumber) {
                cards.push(value);
            }
        }

        // Shuffle the cards
        return shuffleArray(cards);
    }

    function displayCards() {
        cardsContainer.innerHTML = '';

        currentCards.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = value;
            card.dataset.index = index;
            card.dataset.value = value;

            card.addEventListener('click', () => {
                if (!card.classList.contains('selected') && !card.classList.contains('disabled')) {
                    selectCard(card, index);
                }
            });

            cardsContainer.appendChild(card);
        });
    }

    function selectCard(card, index) {
        card.classList.add('selected');
        card.classList.add('disabled');

        const value = parseInt(card.dataset.value);
        selectedCards.push({ index, value });

        // Update selected cards display
        const selectedCard = document.createElement('div');
        selectedCard.className = 'selected-card';
        selectedCard.textContent = value;
        selectedCard.dataset.index = index;
        selectedCardsEl.appendChild(selectedCard);

        // Update current sum
        currentSum += value;
        currentSumEl.textContent = currentSum;

        // Check if target is reached
        checkSum();
    }

    function checkSum() {
        if (currentSum === targetNumber) {
            // Correct answer
            feedbackEl.textContent = 'Goed gedaan! Je hebt het juiste getal bereikt!';
            feedbackEl.className = 'feedback correct';

            correctAnswers++;
            
            // Call adaptive difficulty adjustment
            adjustAdaptiveDifficulty(true);
            
            if (currentLevel === 'easy') {
                score += easyPoints;
            } else if (currentLevel === 'medium') {
                score += mediumPoints;
            } else if (currentLevel === 'hard') {
                score += hardPoints;
            } else if (currentLevel === 'adaptive') {
                // Adaptive scoring based on current difficulty level
                if (adaptiveDifficulty === 1) {
                    score += easyPoints;
                } else if (adaptiveDifficulty === 2) {
                    score += mediumPoints;
                } else if (adaptiveDifficulty === 3) {
                    score += hardPoints;
                }
            }
            updateScore();

            // Disable all cards
            document.querySelectorAll('.card').forEach(card => {
                card.classList.add('disabled');
            });

            // Stop the timer
            stopTimer();

            // Animate lootbox
            lootbox.classList.add('animate');
            setTimeout(() => {
                lootbox.classList.remove('animate');
            }, 1000);

            // Automatically proceed to next question after a delay
            setTimeout(() => {
                nextQuestion();
            }, 2000);
        } else if (currentSum > targetNumber) {
            // Sum is too high
            feedbackEl.textContent = 'De som is te hoog! Probeer opnieuw.';
            feedbackEl.className = 'feedback incorrect';

            // Allow trying again
            resetSelection();
        }
    }

    function resetSelection() {
        selectedCards = [];
        currentSum = 0;
        currentSumEl.textContent = currentSum;
        selectedCardsEl.innerHTML = '';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';

        // Reset card selection
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
            card.classList.remove('disabled');
        });
    }

    function updateScore() {
        scoreEl.textContent = score;
    }

    function endGame() {
        fetch('/game/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score
            })
        }).then(response => response.json()).then(data => {
            if (!data?.success) return alert('Something went wrong');

            // Stop the timer
            stopTimer();

            // Hide game container and show result screen
            gameContainer.style.display = 'none';
            resultContainer.style.display = 'block';

            // Update result information
            finalScoreEl.textContent = score;
            correctAnswersEl.textContent = correctAnswers;
            totalQuestionsEl.textContent = totalQuestions;
        });
    }

    function startTimer() {
        // Clear any existing timer
        stopTimer();

        // Set time based on difficulty level
        const settings = levels[currentLevel];
        timeRemaining = settings.timeLimit;

        // Update timer display
        timerValueEl.textContent = timeRemaining;
        timerFill.style.width = '100%';
        timerContainer.style.display = 'block';

        // Start the timer
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerValueEl.textContent = timeRemaining;

            // Update timer bar
            const percentage = (timeRemaining / settings.timeLimit) * 100;
            timerFill.style.width = `${percentage}%`;

            // Change color when time is running out
            if (timeRemaining <= 5) {
                timerFill.style.backgroundColor = '#dc3545'; // Red
            } else {
                timerFill.style.backgroundColor = '#f2ae30'; // Yellow/orange
            }

            if (timeRemaining <= 0) {
                // Time's up
                timeUp();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function timeUp() {
        stopTimer();
        
        // Call adaptive difficulty adjustment for timeout (incorrect)
        adjustAdaptiveDifficulty(false);

        // Show the correct answer combination
        let correctAnswerText = 'Tijd is op! Een juist antwoord was: ' + correctCombination.join(' + ') + ' = ' + targetNumber;
        feedbackEl.textContent = correctAnswerText;
        feedbackEl.className = 'feedback incorrect';

        // Highlight the correct cards
        highlightCorrectCards();

        // Disable all cards
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('disabled');
        });

        // Move to next question after a short delay
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    }

    function highlightCorrectCards() {
        // Find cards with values in correctCombination and highlight them
        const allCards = document.querySelectorAll('.card');
        const usedIndices = [];

        correctCombination.forEach(correctValue => {
            for (let i = 0; i < allCards.length; i++) {
                if (usedIndices.includes(i)) continue;

                const cardValue = parseInt(allCards[i].dataset.value);
                if (cardValue === correctValue) {
                    allCards[i].style.backgroundColor = '#28a745'; // Green
                    allCards[i].style.transform = 'translateY(-5px)';
                    usedIndices.push(i);
                    break;
                }
            }
        });
    }

    // Helper functions
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Initialize the game
    init();

    // Adaptive difficulty functions for Game 2
    function updateAdaptiveSettings() {
        if (currentLevel !== 'adaptive') return;
        
        if (adaptiveDifficulty === 1) {
            // Easy settings
            levels.adaptive.minTarget = 20;
            levels.adaptive.maxTarget = 100;
            levels.adaptive.minCardValue = 5;
            levels.adaptive.maxCardValue = 50;
            levels.adaptive.numberOfCards = 5;
            levels.adaptive.timeLimit = 30;
        } else if (adaptiveDifficulty === 2) {
            // Medium settings
            levels.adaptive.minTarget = 50;
            levels.adaptive.maxTarget = 200;
            levels.adaptive.minCardValue = 10;
            levels.adaptive.maxCardValue = 80;
            levels.adaptive.numberOfCards = 6;
            levels.adaptive.timeLimit = 25;
        } else if (adaptiveDifficulty === 3) {
            // Hard settings
            levels.adaptive.minTarget = 100;
            levels.adaptive.maxTarget = 500;
            levels.adaptive.minCardValue = 25;
            levels.adaptive.maxCardValue = 150;
            levels.adaptive.numberOfCards = 7;
            levels.adaptive.timeLimit = 20;
        }
    }

    function adjustAdaptiveDifficulty(isCorrect) {
        if (currentLevel !== 'adaptive') return;
        
        if (isCorrect) {
            consecutiveCorrect++;
            consecutiveWrong = 0;
            
            if (consecutiveCorrect >= 2 && adaptiveDifficulty < 3) {
                adaptiveDifficulty++;
                consecutiveCorrect = 0;
                updateAdaptiveSettings();
                console.log(`Game 2: Moeilijkheid verhoogd naar level ${adaptiveDifficulty}`);
            }
        } else {
            consecutiveWrong++;
            consecutiveCorrect = 0;
            
            if (consecutiveWrong >= 2 && adaptiveDifficulty > 1) {
                adaptiveDifficulty--;
                consecutiveWrong = 0;
                updateAdaptiveSettings();
                console.log(`Game 2: Moeilijkheid verlaagd naar level ${adaptiveDifficulty}`);
            }
        }
    }
});