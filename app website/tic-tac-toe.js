const cells = document.querySelectorAll('.cell');
const board = document.querySelector('.board');
const gameStatus = document.querySelector('.game-status');
const restartBtn = document.querySelector('.restart');
let currentPlayer = 'X';  // Start with 'X'
let gameActive = true;

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);

function handleCellClick(event) {
    const cell = event.target;
    if (cell.textContent === '' && gameActive) {
        cell.textContent = currentPlayer;
        if (checkWin() || checkDraw()) {
            gameActive = false;
            gameStatus.textContent = checkDraw() ? 'Draw!' : currentPlayer + ' wins!';
            return;
        }
        switchPlayer();
        if (currentPlayer === 'O') {
            computerMove();
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        if (cells[pattern[0]].textContent && cells[pattern[0]].textContent === cells[pattern[1]].textContent && cells[pattern[1]].textContent === cells[pattern[2]].textContent) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function restartGame() {
    cells.forEach(cell => {
        cell.textContent = '';
    });
    gameStatus.textContent = '';
    currentPlayer = 'X';
    gameActive = true;
}

function computerMove() {
    let availableCells = [...cells].filter(cell => cell.textContent === '');
    if (availableCells.length) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        availableCells[randomIndex].textContent = 'O';
        if (checkWin() || checkDraw()) {
            gameActive = false;
            gameStatus.textContent = checkDraw() ? 'Draw!' : currentPlayer + ' wins!';
            return;
        }
        switchPlayer();
    }
}