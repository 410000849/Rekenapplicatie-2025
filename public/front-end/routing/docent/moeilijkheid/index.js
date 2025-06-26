const groepid = document.getElementById('groepid');
const saveDifficultyBtn = document.getElementById('save-difficulty');
const saveFeedback = document.getElementById('save-feedback');
const game1Description = document.getElementById('game1-description');
const game2Description = document.getElementById('game2-description');

let currentSettings = {
    game1: 'easy',
    game2: 'easy'
};

// Difficulty descriptions
const descriptions = {
    game1: {
        easy: '<strong>Makkelijk:</strong> Optellen en aftrekken (1-10), meer tijd per vraag',
        medium: '<strong>Gemiddeld:</strong> Optellen, aftrekken en vermenigvuldigen (5-20), normale tijd',
        hard: '<strong>Moeilijk:</strong> Alle bewerkingen inclusief delen (10-50), minder tijd',
        adaptive: '<strong>Adaptief:</strong> Begint makkelijk en past zich aan op basis van prestaties'
    },
    game2: {
        easy: '<strong>Makkelijk:</strong> Doelgetallen 20-100, kaarten 5-50, 30 seconden',
        medium: '<strong>Gemiddeld:</strong> Doelgetallen 50-200, kaarten 10-80, 25 seconden',
        hard: '<strong>Moeilijk:</strong> Doelgetallen 100-500, kaarten 25-150, 20 seconden',
        adaptive: '<strong>Adaptief:</strong> Begint makkelijk en past zich aan op basis van prestaties'
    }
};

// Load current difficulty settings
async function loadDifficultySettings() {
    try {
        const response = await fetch('/groep/difficulty');
        const data = await response.json();
        
        if (data.success) {
            currentSettings.game1 = data.difficulties.game1_difficulty || 'easy';
            currentSettings.game2 = data.difficulties.game2_difficulty || 'easy';
            
            // Update UI
            updateActiveButtons();
            updateDescriptions();
        }
    } catch (error) {
        console.error('Error loading difficulty settings:', error);
    }
}

// Load group information
async function loadGroupInfo() {
    try {
        const response = await fetch('/groep/current');
        const data = await response.json();
        
        if (data.success) {
            groepid.textContent = `Groep ID: ${data.group_id}`;
        }
    } catch (error) {
        console.error('Error loading group info:', error);
    }
}

// Update active buttons based on current settings
function updateActiveButtons() {
    // Remove all active classes
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current settings (safely)
    const game1Btn = document.querySelector(`[data-game="1"][data-level="${currentSettings.game1}"]`);
    const game2Btn = document.querySelector(`[data-game="2"][data-level="${currentSettings.game2}"]`);
    
    if (game1Btn) game1Btn.classList.add('active');
    if (game2Btn) game2Btn.classList.add('active');
}

// Update descriptions
function updateDescriptions() {
    game1Description.innerHTML = descriptions.game1[currentSettings.game1] || 'Beschrijving niet beschikbaar';
    game2Description.innerHTML = descriptions.game2[currentSettings.game2] || 'Beschrijving niet beschikbaar';
}

// Handle difficulty button clicks
function handleDifficultyClick(event) {
    const btn = event.target;
    if (!btn.classList.contains('difficulty-btn')) return;
    
    const game = btn.dataset.game;
    const level = btn.dataset.level;
    
    // Update current settings
    if (game === '1') {
        currentSettings.game1 = level;
    } else if (game === '2') {
        currentSettings.game2 = level;
    }
    
    // Update UI
    updateActiveButtons();
    updateDescriptions();
}

// Save difficulty settings
async function saveDifficultySettings() {
    saveDifficultyBtn.disabled = true;
    saveFeedback.className = 'feedback-message';
    saveFeedback.style.display = 'none';
    
    try {
        const response = await fetch('/groep/difficulty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                game1Difficulty: currentSettings.game1,
                game2Difficulty: currentSettings.game2
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            saveFeedback.className = 'feedback-message success';
            saveFeedback.textContent = 'Moeilijkheidsgraad succesvol opgeslagen!';
        } else {
            saveFeedback.className = 'feedback-message error';
            saveFeedback.textContent = data.message || 'Er ging iets mis bij het opslaan.';
        }
    } catch (error) {
        saveFeedback.className = 'feedback-message error';
        saveFeedback.textContent = 'Er ging iets mis bij het opslaan.';
    } finally {
        saveDifficultyBtn.disabled = false;
        saveFeedback.style.display = 'block';
        
        // Hide feedback after 3 seconds
        setTimeout(() => {
            saveFeedback.style.display = 'none';
        }, 3000);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadGroupInfo();
    loadDifficultySettings();
});

document.addEventListener('click', handleDifficultyClick);
saveDifficultyBtn.addEventListener('click', saveDifficultySettings);
