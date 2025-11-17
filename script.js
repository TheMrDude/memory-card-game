document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const comboDisplay = document.getElementById('combo');
    const comboFill = document.getElementById('combo-fill');
    const resetButton = document.getElementById('reset-btn');
    const pauseButton = document.getElementById('pause-btn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const winModal = document.getElementById('win-modal');
    const playAgainBtn = document.getElementById('play-again-btn');
    const particlesContainer = document.getElementById('particles');

    // Game Configuration
    const difficulties = {
        easy: { rows: 4, cols: 4, emojis: ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍍', '🥝'] },
        medium: { rows: 4, cols: 5, emojis: ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍍', '🥝', '🍒', '🥭'] },
        hard: { rows: 6, cols: 6, emojis: ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍍', '🥝', '🍒', '🥭', '🍓', '🫐', '🍑', '🥥', '🍐', '🥑', '🍅', '🥔'] }
    };

    // Game State
    let currentDifficulty = 'easy';
    let cards = [];
    let score = 0;
    let moves = 0;
    let combo = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let timerInterval = null;
    let startTime = null;
    let isPaused = false;
    let canFlip = true;

    // Audio Context for sound effects (using Web Audio API)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Sound Effects Functions
    function playSound(frequency, duration, type = 'sine') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    function playFlipSound() {
        playSound(400, 0.1, 'sine');
    }

    function playMatchSound() {
        playSound(523.25, 0.1, 'sine');
        setTimeout(() => playSound(659.25, 0.1, 'sine'), 100);
        setTimeout(() => playSound(783.99, 0.2, 'sine'), 200);
    }

    function playWrongSound() {
        playSound(200, 0.3, 'sawtooth');
    }

    function playComboSound() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => playSound(800 + (i * 200), 0.1, 'square'), i * 50);
        }
    }

    function playWinSound() {
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
        notes.forEach((note, index) => {
            setTimeout(() => playSound(note, 0.2, 'sine'), index * 100);
        });
    }

    // Background Particles
    function createBackgroundParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Match Particle Effects
    function createMatchParticles(x, y) {
        const particles = ['✨', '⭐', '💫', '🌟'];
        const numParticles = 12;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('match-particle');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            const angle = (Math.PI * 2 * i) / numParticles;
            const distance = 100 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty('--x', tx + 'px');
            particle.style.setProperty('--y', ty + 'px');

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Timer Functions
    function startTimer() {
        if (!startTime) {
            startTime = Date.now();
        }
        timerInterval = setInterval(updateTimer, 100);
    }

    function updateTimer() {
        if (!isPaused && startTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        stopTimer();
        startTime = null;
        timerDisplay.textContent = '0:00';
    }

    // Score Functions
    function calculateScore(isMatch) {
        if (isMatch) {
            const comboBonus = combo * 50;
            const timeBonus = Math.max(0, 100 - moves * 2);
            score += 100 + comboBonus + timeBonus;
            updateCombo(combo + 1);
        } else {
            updateCombo(0);
            score = Math.max(0, score - 10);
        }
        scoreDisplay.textContent = score;
    }

    function updateCombo(newCombo) {
        combo = newCombo;
        comboDisplay.textContent = `${combo}x`;

        const comboPercent = Math.min(100, (combo / 5) * 100);
        comboFill.style.width = comboPercent + '%';

        if (combo > 0 && combo % 3 === 0) {
            playComboSound();
            comboDisplay.parentElement.style.animation = 'none';
            setTimeout(() => {
                comboDisplay.parentElement.style.animation = '';
            }, 10);
        }
    }

    // Local Storage Functions
    function getBestScore(difficulty) {
        return localStorage.getItem(`memoryGame_best_${difficulty}`) || null;
    }

    function setBestScore(difficulty, newScore) {
        const currentBest = getBestScore(difficulty);
        if (!currentBest || newScore > parseInt(currentBest)) {
            localStorage.setItem(`memoryGame_best_${difficulty}`, newScore);
            return true; // New record
        }
        return false;
    }

    function updateBestScores() {
        document.getElementById('best-easy').textContent = getBestScore('easy') || '-';
        document.getElementById('best-medium').textContent = getBestScore('medium') || '-';
        document.getElementById('best-hard').textContent = getBestScore('hard') || '-';
    }

    // Shuffle Function
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Create Board
    function createBoard() {
        gameBoard.innerHTML = '';
        const config = difficulties[currentDifficulty];
        const emojiCount = (config.rows * config.cols) / 2;
        const selectedEmojis = config.emojis.slice(0, emojiCount);

        cards = shuffleArray([...selectedEmojis, ...selectedEmojis]);
        totalPairs = selectedEmojis.length;

        gameBoard.className = `game-board ${currentDifficulty}`;

        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // Flip Card
    function flipCard() {
        if (!canFlip || isPaused || flippedCards.length >= 2) return;
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

        // Start timer on first move
        if (!startTime) {
            startTimer();
        }

        playFlipSound();

        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            canFlip = false;
            setTimeout(checkMatch, 600);
        }
    }

    // Check Match
    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.emoji === card2.dataset.emoji) {
            // Match found!
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            playMatchSound();
            calculateScore(true);

            // Create particle effects
            const rect1 = card1.getBoundingClientRect();
            const rect2 = card2.getBoundingClientRect();
            createMatchParticles(rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);
            createMatchParticles(rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);

            // Check win condition
            if (matchedPairs === totalPairs) {
                setTimeout(showWinModal, 800);
            }
        } else {
            // No match
            playWrongSound();
            calculateScore(false);

            card1.classList.add('wrong');
            card2.classList.add('wrong');

            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong');
                card2.classList.remove('flipped', 'wrong');
                card1.textContent = '';
                card2.textContent = '';
            }, 500);
        }

        flippedCards = [];
        canFlip = true;
    }

    // Show Win Modal
    function showWinModal() {
        stopTimer();
        playWinSound();

        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('final-score').textContent = score;
        document.getElementById('final-moves').textContent = moves;
        document.getElementById('final-time').textContent = timeString;

        const isNewRecord = setBestScore(currentDifficulty, score);
        const newRecordEl = document.getElementById('new-record');

        if (isNewRecord) {
            newRecordEl.style.display = 'block';
        } else {
            newRecordEl.style.display = 'none';
        }

        updateBestScores();
        winModal.classList.add('active');
    }

    // Reset Game
    function resetGame() {
        moves = 0;
        score = 0;
        combo = 0;
        matchedPairs = 0;
        flippedCards = [];
        canFlip = true;
        isPaused = false;

        movesDisplay.textContent = moves;
        scoreDisplay.textContent = score;
        updateCombo(0);

        resetTimer();
        createBoard();

        pauseButton.querySelector('.btn-icon').textContent = '⏸️';
        pauseButton.innerHTML = '<span class="btn-icon">⏸️</span> Pause';
    }

    // Pause/Resume
    function togglePause() {
        isPaused = !isPaused;

        if (isPaused) {
            pauseButton.querySelector('.btn-icon').textContent = '▶️';
            pauseButton.innerHTML = '<span class="btn-icon">▶️</span> Resume';
            gameBoard.style.pointerEvents = 'none';
            gameBoard.style.opacity = '0.5';
        } else {
            pauseButton.querySelector('.btn-icon').textContent = '⏸️';
            pauseButton.innerHTML = '<span class="btn-icon">⏸️</span> Pause';
            gameBoard.style.pointerEvents = 'auto';
            gameBoard.style.opacity = '1';
        }
    }

    // Change Difficulty
    function changeDifficulty(difficulty) {
        currentDifficulty = difficulty;

        difficultyButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });

        resetGame();
    }

    // Event Listeners
    resetButton.addEventListener('click', resetGame);
    pauseButton.addEventListener('click', togglePause);
    playAgainBtn.addEventListener('click', () => {
        winModal.classList.remove('active');
        resetGame();
    });

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.difficulty);
        });
    });

    // Close modal on background click
    winModal.addEventListener('click', (e) => {
        if (e.target === winModal) {
            winModal.classList.remove('active');
            resetGame();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            resetGame();
        } else if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
            e.preventDefault();
            if (startTime) {
                togglePause();
            }
        }
    });

    // Initialize
    createBackgroundParticles();
    updateBestScores();
    createBoard();
});
