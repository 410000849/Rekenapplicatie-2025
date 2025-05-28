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
    const lootbox = document.querySelector('.lootbox');

    // Game state
    let gameStarted = false;
    let currentLevel = 'easy';
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
        }
    };

    // Event listeners
    startGameBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetSelection);
    playAgainBtn.addEventListener('click', returnToStartScreen);
    homeBtn.addEventListener('click', () => {
        window.location.href = '/leerling/home';
    });

    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLevel = btn.dataset.level;
        });
    });

    // Initialize game - show start screen
    function init() {
        startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        resultContainer.style.display = 'none';
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
            if (currentLevel === 'easy') {
                score += easyPoints;
            } else if (currentLevel === 'medium') {
                score += mediumPoints;
            } else if (currentLevel === 'hard') {
                score += hardPoints;
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
        // Stop the timer
        stopTimer();
        
        // Hide game container and show result screen
        gameContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Update result information
        finalScoreEl.textContent = score;
        correctAnswersEl.textContent = correctAnswers;
        totalQuestionsEl.textContent = totalQuestions;
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
});