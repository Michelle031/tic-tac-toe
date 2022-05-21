var originalBoard;
const player_ = 'O';
const ai = 'X';
const winRules = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8] 
];

const squares = document.querySelectorAll(".q");
const button2 = document.querySelector(".reset");
const textPanel = document.querySelector(".text");
const displayPanel = document.querySelector(".endgame");
const grid_ = document.querySelector(".maybe")
button2.addEventListener("click", start);

start();

function start() {
    displayPanel.style.display = "none";
    originalBoard = Array.from(Array(9).keys());
    grid_.classList.remove("hi");
    for(var i = 0; i < squares.length; i++) {
        squares[i].innerText = "";
        squares[i].style.removeProperty('background-color');
        squares[i].addEventListener('click', turnFunc);
    }
}

function turnFunc(square) {
    if (typeof originalBoard[square.target.id == 'number']){
    turn(square.target.id, player_);
    if(!checkVictory(originalBoard, player_) && !checkTie()) turn(bestSquare(), ai);
    }
}

function turn(squareId, player){
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWin = checkVictory(originalBoard, player);
    if (gameWin) gameOver(gameWin);
}

function checkVictory(board, player) {
    let plays = board.reduce((acculum, element, i) =>
    (element === player) ? acculum.concat(i) : acculum,[]);
    let gameWin = null;
    for( let [index, win] of winRules.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWin = {index: index, player: player};
            break;
        }
    }
    return gameWin;
}

function gameOver(gameWin) {
    for (let index of winRules[gameWin.index]) {
        document.getElementById(index).style.backgroundColor =
        gameWin.player == player_ ? "green" : "red";
    }
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener('click', turnFunc);
    }
    announceWinner(gameWin.player == player_ ? "You win" : "You lose");
}

function announceWinner(who) {
    setTimeout(() => displayPanel.style.display = "block" , 1000);
    textPanel.innerText = who;
    setTimeout(() => grid_.classList.add("hi"), 100);

}

function emptySquares() {
    return originalBoard.filter(s => typeof s == 'number');
}


function checkTie() {
    if(emptySquares().length == 0) {
        for (var i = 0; i < squares.length; i++){
            squares[i].style.backgroundColor = "grey";
            squares[i].removeEventListener('click', turnFunc);
        }
        announceWinner("It's a Tie");
        return true;
    }
    return false
}


function bestSquare() {
    return minimax(originalBoard, ai).index;
}

function minimax(newBoard, player) {
    var availSquares = emptySquares();

    if (checkVictory(newBoard, player_)) {
        return {score: -10};
    } else if (checkVictory(newBoard, ai)){
        return {score: 10};
    } else if (availSquares.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for (var i = 0; i < availSquares.length; i++){
        var move = {};
        move.index = newBoard[availSquares[i]];
        newBoard[availSquares[i]] = player;

        if (player == ai) {
            let result = minimax(newBoard, player_);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availSquares[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if(player === ai) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}