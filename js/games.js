document.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.querySelector('#game-status');
    const board = document.querySelector('#tic-tac-toe-board');
    const restartButton = document.querySelector('#restart-button');
    const cells = document.querySelectorAll('.cell');

    let gameActive = true;
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];

    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusDisplay.innerHTML = currentPlayerTurn();
        cells.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove('x', 'o');
        });
    }

    // Initial game setup
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
});

// --- 2048 GAME LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board-2048');
    const scoreElement = document.getElementById('score');
    const newGameBtn = document.getElementById('new-game-btn');
    const size = 4;
    let board = [];
    let score = 0;

    function createBoard() {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                let cell = document.createElement('div');
                cell.classList.add('grid-cell');
                boardElement.appendChild(cell);
            }
        }
    }

    function startGame() {
        board = Array(size).fill(null).map(() => Array(size).fill(0));
        score = 0;
        updateScore();
        addRandomTile();
        addRandomTile();
        drawBoard();
    }

    function drawBoard() {
        // Clear previous tiles
        const oldTiles = document.querySelectorAll('.tile');
        oldTiles.forEach(tile => tile.remove());

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] !== 0) {
                    let tile = document.createElement('div');
                    tile.classList.add('tile', `tile-${board[r][c]}`);
                    tile.textContent = board[r][c];
                    tile.style.top = `${r * 100 + 10}px`; // 100 = 87.5 cell + 10 gap
                    tile.style.left = `${c * 100 + 10}px`;
                    boardElement.appendChild(tile);
                }
            }
        }
    }

    function addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function slide(row) {
        let arr = row.filter(val => val);
        let missing = size - arr.length;
        let zeros = Array(missing).fill(0);
        return arr.concat(zeros);
    }

    function combine(row) {
        for (let i = 0; i < size - 1; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
            }
        }
        return row;
    }

    function operate(row) {
        row = slide(row);
        row = combine(row);
        row = slide(row);
        return row;
    }

    function move(e) {
        let originalBoard = JSON.parse(JSON.stringify(board));
        if (e.key === 'ArrowUp') {
            for (let c = 0; c < size; c++) {
                let col = [];
                for (let r = 0; r < size; r++) col.push(board[r][c]);
                col = operate(col);
                for (let r = 0; r < size; r++) board[r][c] = col[r];
            }
        } else if (e.key === 'ArrowDown') {
            for (let c = 0; c < size; c++) {
                let col = [];
                for (let r = 0; r < size; r++) col.push(board[r][c]);
                col.reverse();
                col = operate(col);
                col.reverse();
                for (let r = 0; r < size; r++) board[r][c] = col[r];
            }
        } else if (e.key === 'ArrowLeft') {
            for (let r = 0; r < size; r++) {
                board[r] = operate(board[r]);
            }
        } else if (e.key === 'ArrowRight') {
            for (let r = 0; r < size; r++) {
                board[r].reverse();
                board[r] = operate(board[r]);
                board[r].reverse();
            }
        }
        
        if (JSON.stringify(board) !== JSON.stringify(originalBoard)) {
            addRandomTile();
            drawBoard();
            updateScore();
            // Check for game over
        }
    }

    // Initial setup
    createBoard();
    startGame();
    newGameBtn.addEventListener('click', startGame);
    document.addEventListener('keydown', move);
});

// --- PENALTY KICK SIMULATOR LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const goal = document.getElementById('pk-goal');
    const scoreDisplay = document.getElementById('pk-score');
    const highScoreDisplay = document.getElementById('pk-high-score');
    const statusDisplay = document.getElementById('pk-status');

    const COLS = 8;
    const ROWS = 4;
    const CELL_COUNT = COLS * ROWS;

    let score = 0;
    let highScore = localStorage.getItem('pkHighScore') || 0;
    let shooting = false;

    function setupGoal() {
        for (let i = 0; i < CELL_COUNT; i++) {
            const cell = document.createElement('div');
            cell.classList.add('goal-cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleShot);
            goal.appendChild(cell);
        }
        highScoreDisplay.textContent = highScore;
    }

    function handleShot(event) {
        if (shooting) return; // Prevent multiple shots at once
        shooting = true;

        const shotIndex = parseInt(event.target.dataset.index);

        // Goalie dives to a random 2x2 area
        // We subtract to ensure the 2x2 area doesn't go out of bounds
        const goalieCol = Math.floor(Math.random() * (COLS - 1));
        const goalieRow = Math.floor(Math.random() * (ROWS - 1));
        const goalieTopLeftIndex = goalieRow * COLS + goalieCol;

        // Determine all 4 cells the goalie covers
        const goalieCoverage = [
            goalieTopLeftIndex,
            goalieTopLeftIndex + 1,
            goalieTopLeftIndex + COLS,
            goalieTopLeftIndex + COLS + 1
        ];

        // Show the shot and save attempt
        const result = showResult(shotIndex, goalieTopLeftIndex, goalieCoverage.includes(shotIndex));

        setTimeout(() => {
            updateScore(result);
            shooting = false;
        }, 1500); // Wait 1.5 seconds before resetting for the next shot
    }
    
    function showResult(shotIndex, goalieIndex, isSave) {
        // Create and position ball
        let ball = document.createElement('div');
        ball.className = 'pk-ball';
        goal.appendChild(ball);
        const shotY = Math.floor(shotIndex / COLS) * 60 + 10;
        const shotX = (shotIndex % COLS) * 60 + 10;
        ball.style.top = `${shotY}px`;
        ball.style.left = `${shotX}px`;
        ball.style.display = 'block';

        // Create and position goalie
        let goalie = document.createElement('div');
        goalie.className = 'pk-goalie';
        goal.appendChild(goalie);
        const goalieY = Math.floor(goalieIndex / COLS) * 60;
        const goalieX = (goalieIndex % COLS) * 60;
        goalie.style.top = `${goalieY}px`;
        goalie.style.left = `${goalieX}px`;
        goalie.style.display = 'block';

        if (isSave) {
            statusDisplay.textContent = "SAVED!";
        } else {
            statusDisplay.textContent = "GOAL!";
        }
        
        // Hide them after a moment
        setTimeout(() => {
            ball.remove();
            goalie.remove();
            statusDisplay.textContent = "Take your next shot!";
        }, 1400);

        return !isSave; // Return true for a goal, false for a save
    }

    function updateScore(isGoal) {
        if (isGoal) {
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('pkHighScore', highScore);
                highScoreDisplay.textContent = highScore;
            }
        } else {
            score = 0;
        }
        scoreDisplay.textContent = score;
    }

    // Initial setup
    setupGoal();
});