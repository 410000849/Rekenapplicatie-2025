// Game variables
let currentLevel = 'easy';
let groupDifficultyLoaded = false;
let score = 0;
let correctAnswer = null;
let options = [];
let gameRunning = false;
let currentQuestionIndex = 0;
let totalQuestions = 10; // Hardcoded to 10 questions
let correctAnswers = 0;
let timerInterval = null;
let timePerQuestion = 10; // Hardcoded to 10 seconds per question
let remainingTime = 0;
let easyPoints = 10;
let mediumPoints = 15;
let hardPoints = 20;

// Image paths
const happyImage = "/assets/goed.png"; // Replace with your actual image
const sadImage = "/assets/fout.png";    // Replace with your actual image

// Timing settings for different levels (in milliseconds)
const levelSettings = {
    easy: {
        timePerOption: 1000,
        operations: ['+', '-'],
        minNum: 1,
        maxNum: 10
    },
    medium: {
        timePerOption: 800,
        operations: ['+', '-', '*'],
        minNum: 5,
        maxNum: 20
    },
    hard: {
        timePerOption: 600,
        operations: ['+', '-', '*', '/'],
        minNum: 10,
        maxNum: 50
    },
    // gemaakt door Brandon
        adaptive: {
        timePerOption: 800, // Start met medium timing
        operations: ['+', '-'], // Start met makkelijke operaties
        minNum: 1, 
        maxNum: 10
    }
};

// moeilijksheid graad (brandon)
let adaptiveDifficulty = 1; // Start level (1=easy, 2=medium, 3=hard)
let consecutiveCorrect = 0;
let consecutiveWrong = 0;

// brandon
function updateAdaptiveSettings() {
    console.log(`Updating adaptive settings for difficulty level ${adaptiveDifficulty}`);
    if (currentLevel !== 'adaptive') return;
    
    // Hier moet jij code toevoegen die dit doet:
    if (adaptiveDifficulty === 1) {
        // (makkelijk)
        levelSettings.adaptive.operations = ['+', '-']
        levelSettings.adaptive.minNum = 1
        levelSettings.adaptive.maxNum = 10
    } else if (adaptiveDifficulty === 2) {
        // (gemiddeld)
        levelSettings.adaptive.operations = ['+', '-', '*']
        levelSettings.adaptive.minNum = 5
        levelSettings.adaptive.maxNum = 20
    } else if (adaptiveDifficulty === 3) {
        //(moeilijk)
        levelSettings.adaptive.operations = ['+', '-', '*', '/']
        levelSettings.adaptive.minNum = 10
        levelSettings.adaptive.maxNum = 50
    }
}


// adapative moeilijksheid update (brandon)
function adjustAdaptiveDifficulty(isCorrect) {
    if (currentLevel !== 'adaptive') return;
    
    if (isCorrect) {
        // Goed antwoord
        consecutiveCorrect++;
        consecutiveWrong = 0;
        
        // Na 2 goede antwoorden op rij moeilijker 
        if (consecutiveCorrect >= 2 && adaptiveDifficulty < 3) {
            adaptiveDifficulty++;
            consecutiveCorrect = 0;
            updateAdaptiveSettings();
            console.log(`Moeilijkheid verhoogd naar level ${adaptiveDifficulty}`);
        }
    } else {
        // Fout antwoord
        consecutiveWrong++;
        consecutiveCorrect = 0;
        
        // Na 2 foute antwoorden op rij: makkelijker maken
        if (consecutiveWrong >= 2 && adaptiveDifficulty > 1) {
            adaptiveDifficulty--;
            consecutiveWrong = 0;
            updateAdaptiveSettings();
            console.log(`Moeilijkheid verlaagd naar level ${adaptiveDifficulty}`);
        }
    }
}

// DOM elements
const problemContainer = document.querySelector('.problem-container');
const optionA = document.getElementById('option-a');
const optionB = document.getElementById('option-b');
const optionC = document.getElementById('option-c');
const btnA = document.getElementById('btn-a');
const btnB = document.getElementById('btn-b');
const btnC = document.getElementById('btn-c');
const answerButtons = document.querySelector('.answer-buttons');
const feedbackElement = document.querySelector('.feedback');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const levelBtns = document.querySelectorAll('.level-btn');
const lootbox = document.querySelector('.lootbox');
const resultContainer = document.getElementById('result-container');
const finalScoreElement = document.getElementById('final-score');
const correctAnswersElement = document.getElementById('correct-answers');
const totalQuestionsElement = document.getElementById('total-questions');
const playAgainBtn = document.getElementById('play-again-btn');
const fireworksElement = document.getElementById('fireworks');
const timerContainer = document.querySelector('.timer-container');
const timerValueElement = document.getElementById('timer-value');
const timerFill = document.querySelector('.timer-fill');
const resultFeedback = document.getElementById('result-feedback');
const character = document.querySelector('.character');
const characterImg = document.getElementById('character-img');

// Load group difficulty settings
async function loadGroupDifficulty() {
    try {
        const response = await fetch('/groep/difficulty');
        const data = await response.json();
        
        if (data.success) {
            currentLevel = data.difficulties.game1_difficulty || 'easy';
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

// Generate a random number within a range
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a math problem based on level
function generateProblem() {
    const settings = levelSettings[currentLevel];
    const operations = settings.operations;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    // Generate numbers based on level settings
    let num1 = randomNumber(settings.minNum, settings.maxNum);
    let num2 = randomNumber(settings.minNum, settings.maxNum);
    let answer;

    // Calculate answer based on operation
    switch (operation) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            // Make sure result is positive
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
        case '/':
            // Make division easier - ensure num1 is divisible by num2
            num2 = randomNumber(2, 5);
            answer = randomNumber(1, 5);
            num1 = num2 * answer;
            break;
    }

    const problem = `${num1} ${operation} ${num2} = ?`;
    console.log(`Generated problem: ${problem} (answer: ${answer}) [Level: ${currentLevel}, Adaptive: ${adaptiveDifficulty}]`);
    return { problem, answer }; // Geef het probleem en antwoord terug
}

// Generate options (one correct, two wrong)
function generateOptions(correctAnswer) {
    const settings = levelSettings[currentLevel];
    const range = Math.max(5, Math.floor(correctAnswer * 0.5));

    // Generate two wrong answers that are close but not equal to the correct one
    let wrongAnswer1 = correctAnswer;
    let wrongAnswer2 = correctAnswer;

    while (wrongAnswer1 === correctAnswer) {
        wrongAnswer1 = correctAnswer + randomNumber(-range, range);
        if (wrongAnswer1 <= 0) wrongAnswer1 = randomNumber(1, 5);
    }

    while (wrongAnswer2 === correctAnswer || wrongAnswer2 === wrongAnswer1) {
        wrongAnswer2 = correctAnswer + randomNumber(-range, range);
        if (wrongAnswer2 <= 0) wrongAnswer2 = randomNumber(1, 5);
    }

    // Shuffle the options
    const options = [correctAnswer, wrongAnswer1, wrongAnswer2];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
}

// Show options one by one
function showOptions() {
    optionA.textContent = `A: ${options[0]}`;
    optionB.textContent = `B: ${options[1]}`;
    optionC.textContent = `C: ${options[2]}`;

    const settings = levelSettings[currentLevel];

    // Reset opacity
    optionA.style.opacity = 0;
    optionB.style.opacity = 0;
    optionC.style.opacity = 0;

    // Hide answer buttons initially
    answerButtons.style.display = 'none';

    // Show options with delay
    setTimeout(() => {
        optionA.style.opacity = 1;

        setTimeout(() => {
            optionB.style.opacity = 1;

            setTimeout(() => {
                optionC.style.opacity = 1;

                // Show answer buttons after all options are displayed
                setTimeout(() => {
                    answerButtons.style.display = 'flex';
                    // Start the timer
                    startTimer();
                }, 500);

            }, settings.timePerOption);

        }, settings.timePerOption);

    }, 1000);
}

// Start the timer
function startTimer() {
    clearInterval(timerInterval);
    remainingTime = timePerQuestion;
    timerValueElement.textContent = remainingTime;
    timerFill.style.width = '100%';
    timerContainer.style.display = 'block';

    timerInterval = setInterval(() => {
        remainingTime--;
        timerValueElement.textContent = remainingTime;
        timerFill.style.width = `${(remainingTime / timePerQuestion) * 100}%`;

        if (remainingTime <= 3) {
            timerFill.style.backgroundColor = '#ff4d4d'; // Red for warning
        } else {
            timerFill.style.backgroundColor = '#f2ae30'; // Normal color
        }

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            // Time's up - mark as incorrect
            checkAnswer('timeout');
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerContainer.style.display = 'none';
}

// Check the answer
function checkAnswer(selectedOption) {
    // Stop the timer
    stopTimer();

    // Hide answer buttons
    answerButtons.style.display = 'none';

    const correctOptionIndex = options.indexOf(correctAnswer);
    let isCorrect = false;

    if (selectedOption === 'timeout') {
        feedbackElement.innerHTML = `<span>Tijd is om! Het juiste antwoord was ${correctAnswer}</span><img src="${sadImage}" alt="Jammer">`;
        feedbackElement.style.color = 'red';
    } else {
        if (selectedOption === 'A' && correctOptionIndex === 0) {
            isCorrect = true;
        } else if (selectedOption === 'B' && correctOptionIndex === 1) {
            isCorrect = true;
        } else if (selectedOption === 'C' && correctOptionIndex === 2) {
            isCorrect = true;
        }

        if (isCorrect) {
            feedbackElement.innerHTML = `<span>Goed gedaan!</span><img src="${happyImage}" alt="Goed">`;
            feedbackElement.style.color = 'green';
            
            // Add points based on difficulty level
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
            
            correctAnswers++;
            lootbox.classList.add('animate');
            setTimeout(() => {
                lootbox.classList.remove('animate');
            }, 1000);
        } else {
            feedbackElement.innerHTML = `<span>Helaas! Het juiste antwoord was ${correctAnswer}</span><img src="${sadImage}" alt="Jammer">`;
            feedbackElement.style.color = 'red';
        }
    }

    scoreElement.textContent = score;

    // Call adaptive difficulty adjustment (if not timeout)
    if (selectedOption !== 'timeout') {
        adjustAdaptiveDifficulty(isCorrect);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex >= totalQuestions) {
        setTimeout(endGame, 2000);
    } else {
        setTimeout(startRound, 2000);
    }
}

// Start a new round
function startRound() {
    // Reset feedback
    feedbackElement.innerHTML = '';

    // Generate new problem and options
    const { problem, answer } = generateProblem();
    correctAnswer = answer;
    options = generateOptions(answer);

    // Update UI
    problemContainer.textContent = problem;

    // Show options one by one
    showOptions();
}

// End the game
function endGame() {
    gameRunning = false;

    // Voeg score toe
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

        // Enable start button and level buttons
        startBtn.removeAttribute('disabled');
        levelBtns.forEach(btn => btn.removeAttribute('disabled'));

        // Show results
        finalScoreElement.textContent = score;
        correctAnswersElement.textContent = correctAnswers;
        totalQuestionsElement.textContent = totalQuestions;
        resultContainer.style.display = 'block';

        // Show happy or sad image based on score with better sizing
        const passScore = totalQuestions * 5; // 50% correct
        if (score >= passScore) {
            resultFeedback.innerHTML = `<img src="${happyImage}" alt="Goed gedaan" style="max-width: 100px; height: auto;">`;
            // Make character fly away when successful
            setTimeout(() => {
                character.classList.add('fly-away');
            }, 1000);
        } else {
            resultFeedback.innerHTML = `<img src="${sadImage}" alt="Volgende keer beter" style="max-width: 100px; height: auto;">`;
        }

        // Hide ALL game elements from the start screen
        document.querySelector('.game-container').style.display = 'none';

        // Add "Terug naar home" button next to "Play again" button
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '15px';
        buttonContainer.style.marginTop = '20px';

        // Create home button with same styling
        const homeBtn = document.createElement('button');
        homeBtn.textContent = 'Terug naar home';
        homeBtn.classList.add('btn', 'btn-primary'); // Add same classes as playAgainBtn

        // Copy styling from playAgainBtn
        homeBtn.style.backgroundColor = '#f2ae30';
        homeBtn.style.color = 'white';
        homeBtn.style.padding = '10px 20px';
        homeBtn.style.borderRadius = '5px';
        homeBtn.style.border = 'none';
        homeBtn.style.cursor = 'pointer';
        homeBtn.style.fontWeight = 'bold';

        // Add event listener to navigate to home
        homeBtn.addEventListener('click', () => {
            window.location.href = '/leerling/home';
        });

        // Replace the existing play again button with our container
        if (playAgainBtn.parentNode) {
            // Put both buttons in the container
            buttonContainer.appendChild(playAgainBtn.cloneNode(true));
            buttonContainer.appendChild(homeBtn);

            // Replace the original button with our container
            playAgainBtn.parentNode.replaceChild(buttonContainer, playAgainBtn);

            // Re-add event listener to the cloned play again button
            buttonContainer.firstChild.addEventListener('click', startGame);
        }

        // Show fireworks if score is good
        if (score >= totalQuestions * 7) { // 70% correct
            showFireworks();
        }
    })
}



// Start the game
function startGame() {
    gameRunning = true;
    score = 0;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    scoreElement.textContent = score;


     if (currentLevel === 'adaptive') {
    adaptiveDifficulty = 1;
    consecutiveCorrect = 0;
    consecutiveWrong = 0;
    updateAdaptiveSettings();
    }
    


    // Show game container
    document.querySelector('.game-container').style.display = 'block';
    // Hide result container
    resultContainer.style.display = 'none';

    // Reset character position
    character.classList.remove('fly-away');

    // Disable start button and level buttons
    startBtn.setAttribute('disabled', true);
    levelBtns.forEach(btn => btn.setAttribute('disabled', true));

    // Reset problem container display
    problemContainer.style.display = 'block';

    startRound();
}

// Show fireworks animation
function showFireworks() {
    fireworksElement.style.display = 'block';

    // Create fireworks
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.position = 'absolute';
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 100}%`;
            firework.style.width = '5px';
            firework.style.height = '5px';
            firework.style.borderRadius = '50%';
            firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            firework.style.boxShadow = `0 0 10px 2px hsl(${Math.random() * 360}, 100%, 50%)`;

            fireworksElement.appendChild(firework);

            // Animate firework
            const duration = 1000 + Math.random() * 1000;
            firework.animate(
                [
                    { transform: 'scale(0)', opacity: 1 },
                    { transform: 'scale(20)', opacity: 0 }
                ],
                {
                    duration: duration,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );

            // Remove firework after animation
            setTimeout(() => {
                firework.remove();
            }, duration);

        }, i * 200);
    }

    // Hide fireworks after all animations
    setTimeout(() => {
        fireworksElement.style.display = 'none';
        fireworksElement.innerHTML = '';
    }, 5000);
}

// Event listeners
startBtn.addEventListener('click', () => {
    if (!groupDifficultyLoaded) {
        alert('Laden van instellingen...');
        return;
    }
    startGame();
});

btnA.addEventListener('click', () => {
    if (!gameRunning) return;
    checkAnswer('A');
});

btnB.addEventListener('click', () => {
    if (!gameRunning) return;
    checkAnswer('B');
});

btnC.addEventListener('click', () => {
    if (!gameRunning) return;
    checkAnswer('C');
});

// Level buttons are disabled - difficulty is set by teacher
levelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        return false;
    });
});

playAgainBtn.addEventListener('click', startGame);

// Load group difficulty when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGroupDifficulty();
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || answerButtons.style.display === 'none') return;

    if (e.key === 'a' || e.key === 'A') {
        checkAnswer('A');
    } else if (e.key === 'b' || e.key === 'B') {
        checkAnswer('B');
    } else if (e.key === 'c' || e.key === 'C') {
        checkAnswer('C');
    }
});