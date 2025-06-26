let currentLevel = 'easy';
let score = 0;
let correctAnswer = null;
let gameRunning = false;
let currentQuestionIndex = 0;
<<<<<<< HEAD
let totalQuestions = 1;
=======
let totalQuestions = 10; // Hardcoded to 10 questions
>>>>>>> 60c3edc93b3a329bc6a561e4a620c9d94e7cb3d4
let correctAnswers = 0;
let timerInterval = null;
let timePerQuestion = 10;
let remainingTime = 0;

let easyPoints = 10;
let mediumPoints = 15; 
let hardPoints = 20;

const happyImage = "/assets/goed.png";
const sadImage = "/assets/fout.png";

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

<<<<<<< HEAD
=======
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
>>>>>>> 60c3edc93b3a329bc6a561e4a620c9d94e7cb3d4
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

// Functie om moeilijkheidsgraad van docent te laden
async function loadGroupDifficulty() {
    try {
        const response = await fetch('/groep/difficulty');
        const data = await response.json();
        
        if (data.success) {
            currentLevel = data.difficulties.game1_difficulty || 'easy';
            updateLevelButtons();
            showDifficultyMessage();
        } else {
            console.log('Geen groep difficulty gevonden, easy mode gebruiken');
        }
    } catch (error) {
        console.error('Fout bij laden difficulty:', error);
    }
}

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

function getDifficultyDisplayName(level) {
<<<<<<< HEAD
    if (level === 'easy') return 'Makkelijk';
    if (level === 'medium') return 'Gemiddeld';
    if (level === 'hard') return 'Moeilijk';
    return 'Makkelijk';
=======
    const names = {
        easy: 'Makkelijk',
        medium: 'Gemiddeld', 
        hard: 'Moeilijk',
        adaptive: 'Adaptief'
    };
    return names[level] || 'Makkelijk';
>>>>>>> 60c3edc93b3a329bc6a561e4a620c9d94e7cb3d4
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem() {
    const settings = levelSettings[currentLevel];
    const operations = settings.operations;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    // Generate numbers based on level settings
    let num1 = randomNumber(settings.minNum, settings.maxNum);
    let num2 = randomNumber(settings.minNum, settings.maxNum);
    let answer;

<<<<<<< HEAD
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
=======
    if (operation === '/') {
        num2 = randomNumber(2, 10);
        answer = randomNumber(1, 10);
        num1 = num2 * answer;
                    console.log(`Generating problem: ${num1} ${operation} ${num2}`);

    } else {
        num1 = randomNumber(settings.minNum, settings.maxNum);
        num2 = randomNumber(settings.minNum, settings.maxNum);
            console.log(`Generating problem: ${num1} ${operation} ${num2}`);

        if (operation === '+') {
            answer = num1 + num2;
        } else if (operation === '-') {
            if (num1 < num2) {
                let temp = num1;
                num1 = num2;
                num2 = temp;
            }
            answer = num1 - num2;
        } else if (operation === '*') {
            answer = num1 * num2;
        }
>>>>>>> dd50212397924571486b69e20719a02fd255eafd
    }

    const problem = `${num1} ${operation} ${num2} = ?`;
    console.log(`Generated problem: ${problem} (answer: ${answer}) [Level: ${currentLevel}, Adaptive: ${adaptiveDifficulty}]`);
    return { problem, answer }; // Geef het probleem en antwoord terug
}

function generateOptions(correctAnswer) {
    const range = Math.max(5, Math.floor(correctAnswer * 0.5));

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

    const options = [correctAnswer, wrongAnswer1, wrongAnswer2];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let temp = options[i];
        options[i] = options[j];
        options[j] = temp;
    }

    return options;
}

function showOptions(options) {
    optionA.textContent = `A: ${options[0]}`;
    optionB.textContent = `B: ${options[1]}`;
    optionC.textContent = `C: ${options[2]}`;

    const settings = levelSettings[currentLevel];

    optionA.style.opacity = 0;
    optionB.style.opacity = 0;
    optionC.style.opacity = 0;

    answerButtons.style.display = 'none';

    setTimeout(() => {
        optionA.style.opacity = 1;

        setTimeout(() => {
            optionB.style.opacity = 1;

            setTimeout(() => {
                optionC.style.opacity = 1;

                setTimeout(() => {
                    answerButtons.style.display = 'flex';
                    startTimer();
                }, 500);

            }, settings.timePerOption);
        }, settings.timePerOption);
    }, 1000);
}

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
            timerFill.style.backgroundColor = '#ff4d4d';
        } else {
            timerFill.style.backgroundColor = '#f2ae30';
        }

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            checkAnswer('timeout');
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerContainer.style.display = 'none';
}

// Checken of het antwoord goed is
function checkAnswer(selectedOption, options) {
    stopTimer();
    answerButtons.style.display = 'none';

    const correctOptionIndex = options.indexOf(correctAnswer);
    let isCorrect = false;

    if (selectedOption === 'timeout') {
        feedbackElement.innerHTML = `<span>Tijd is om!</span>`;
        feedbackElement.style.color = 'red';
    } else {
        if (selectedOption === 'A' && correctOptionIndex === 0) isCorrect = true;
        if (selectedOption === 'B' && correctOptionIndex === 1) isCorrect = true;
        if (selectedOption === 'C' && correctOptionIndex === 2) isCorrect = true;

        if (isCorrect) {
            feedbackElement.innerHTML = `<span>Goed!</span>`;
            feedbackElement.style.color = 'green';
<<<<<<< HEAD
            score += 10;
=======
            
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
            
>>>>>>> 60c3edc93b3a329bc6a561e4a620c9d94e7cb3d4
            correctAnswers++;
            lootbox.classList.add('animate');
            setTimeout(() => lootbox.classList.remove('animate'), 500);
        } else {
            feedbackElement.innerHTML = `<span>Fout!</span>`;
            feedbackElement.style.color = 'red';
        }
    }

    scoreElement.textContent = score;
<<<<<<< HEAD
=======

    // Call adaptive difficulty adjustment (if not timeout)
    if (selectedOption !== 'timeout') {
        adjustAdaptiveDifficulty(isCorrect);
    }

>>>>>>> 60c3edc93b3a329bc6a561e4a620c9d94e7cb3d4
    currentQuestionIndex++;

    if (currentQuestionIndex >= totalQuestions) {
        setTimeout(endGame, 1000);
    } else {
        setTimeout(startRound, 1000);
    }
}

function startRound() {
    feedbackElement.innerHTML = '';

    const { problem, answer } = generateProblem();
    correctAnswer = answer;
    const options = generateOptions(answer);

    problemContainer.textContent = problem;
    showOptions(options);
}

function endGame() {
    gameRunning = false;

    fetch('/game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
    }).then(response => response.json()).then(data => {
        finalScoreElement.textContent = score;
        correctAnswersElement.textContent = correctAnswers;
        totalQuestionsElement.textContent = totalQuestions;
        resultContainer.style.display = 'block';
        document.querySelector('.game-container').style.display = 'none';
    })
}

function startGame() {
    gameRunning = true;
    score = 0;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    scoreElement.textContent = score;

<<<<<<< HEAD
=======

     if (currentLevel === 'adaptive') {
    adaptiveDifficulty = 1;
    consecutiveCorrect = 0;
    consecutiveWrong = 0;
    updateAdaptiveSettings();
    }
    


    // Show game container
>>>>>>> 60c3edc93b3a329bc6a561e4a620c9d94e7cb3d4
    document.querySelector('.game-container').style.display = 'block';
    resultContainer.style.display = 'none';
    startRound();
}

// Event listeners
startBtn.addEventListener('click', startGame);

btnA.addEventListener('click', () => {
    if (!gameRunning) return;
    const options = [
        parseInt(optionA.textContent.split(': ')[1]),
        parseInt(optionB.textContent.split(': ')[1]),
        parseInt(optionC.textContent.split(': ')[1])
    ];
    checkAnswer('A', options);
});

btnB.addEventListener('click', () => {
    if (!gameRunning) return;
    const options = [
        parseInt(optionA.textContent.split(': ')[1]),
        parseInt(optionB.textContent.split(': ')[1]),
        parseInt(optionC.textContent.split(': ')[1])
    ];
    checkAnswer('B', options);
});

btnC.addEventListener('click', () => {
    if (!gameRunning) return;
    const options = [
        parseInt(optionA.textContent.split(': ')[1]),
        parseInt(optionB.textContent.split(': ')[1]),
        parseInt(optionC.textContent.split(': ')[1])
    ];
    checkAnswer('C', options);
});

playAgainBtn.addEventListener('click', startGame);

document.addEventListener('DOMContentLoaded', loadGroupDifficulty);

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    const options = [
        parseInt(optionA.textContent.split(': ')[1]),
        parseInt(optionB.textContent.split(': ')[1]),
        parseInt(optionC.textContent.split(': ')[1])
    ];
    if (e.key === 'a' || e.key === 'A') checkAnswer('A', options);
    if (e.key === 'b' || e.key === 'B') checkAnswer('B', options);
    if (e.key === 'c' || e.key === 'C') checkAnswer('C', options);
});