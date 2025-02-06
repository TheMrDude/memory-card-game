document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const resetButton = document.getElementById('reset-btn');
    
    const emojis = ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍍', '🥝'];
    let cards = [...emojis, ...emojis];
    let moves = 0;
    let flippedCards = [];
    let matchedPairs = 0;

    function shuffleCards() {
        return cards.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        const shuffledCards = shuffleCards();
        
        shuffledCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.emoji;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                movesDisplay.textContent = moves;
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            if (matchedPairs === emojis.length) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${moves} moves!`);
                }, 500);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }

        flippedCards = [];
    }

    function resetGame() {
        moves = 0;
        movesDisplay.textContent = moves;
        matchedPairs = 0;
        flippedCards = [];
        createBoard();
    }

    resetButton.addEventListener('click', resetGame);
    createBoard();
});
