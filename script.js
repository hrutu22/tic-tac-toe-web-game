
const clickSound =
document.getElementById("clickSound");const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const difficulty = document.getElementById("difficulty");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");

let xScore =
Number(localStorage.getItem("xScore")) || 0;

let oScore =
Number(localStorage.getItem("oScore")) || 0;

const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const drawsEl = document.getElementById("draws");

let wins = 0;
let losses = 0;
let draws = 0;

let board = ["","","","","","","","",""];

let gameActive = true;

const winPatterns = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,4,8],
 [2,4,6]
];

cells.forEach(cell=>{
    cell.addEventListener("click",playerMove);
});

restartBtn.addEventListener("click",restartGame);

function playerMove(){

    clickSound.currentTime = 0;
    clickSound.play();
    const index = this.dataset.index;

    if(board[index] !== "" || !gameActive){
        return;
    }

    board[index] = "X";
    this.textContent = "X";

    time = 10;
timer.textContent = time;   

    checkWinner();

    if(gameActive){
        setTimeout(aiMove,500);
    }
}

function aiMove(){

    let level = difficulty.value;

    if(level === "easy"){
        easyMove();
    }

    else if(level === "medium"){
        mediumMove();
    }

    else{
        hardMove();
    }
}

function easyMove(){

    let empty = board
    .map((cell,index)=>
        cell === "" ? index : null)
    .filter(index => index !== null);

    let move =
    empty[Math.floor(Math.random()*empty.length)];

    board[move] = "O";
    cells[move].textContent = "O";

    checkWinner();
}
function mediumMove(){

    let move = findWinningMove("O");

    if(move === null){
        move = findWinningMove("X");
    }

    if(move === null){  

        let empty = board
        .map((cell,index)=>
            cell === "" ? index : null)
        .filter(index => index !== null);

        move =
        empty[Math.floor(Math.random()*empty.length)];
    }

    board[move] = "O";
    cells[move].textContent = "O";

    checkWinner();
}


function findWinningMove(player){

    for(let pattern of winPatterns){

        const [a,b,c] = pattern;

        let values = [
            board[a],
            board[b],
            board[c]
        ];

        if(
        values.filter(v => v === player).length === 2 &&
        values.includes("")
        ){

            if(board[a] === "") return a;
            if(board[b] === "") return b;
            if(board[c] === "") return c;
        }
    }

    return null;
}

function hardMove(){

    if(board[4] === ""){
        makeMove(4);
        return;
    }

    let move = findWinningMove("O");

    if(move !== null){
        makeMove(move);
        return;
    }

    move = findWinningMove("X");

    if(move !== null){
        makeMove(move);
        return;
    }

    const corners = [0,2,6,8];

    for(let corner of corners){
        if(board[corner] === ""){
            makeMove(corner);
            return;
        }
    }

    easyMove();
}

function makeMove(index){

    board[index] = "O";

    cells[index].textContent = "O";
    time = 10;
timer.textContent = time;

    checkWinner();
}

function checkWinner(){

    let winner = null;

    winPatterns.forEach(pattern=>{

        const [a,b,c] = pattern;

        if(
        board[a] &&
        board[a]===board[b] &&
        board[a]===board[c]
        ){

            winner = board[a];

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");
        }
    });

    if(winner){

    confetti({
        particleCount:150,
        spread:90,
        origin:{y:0.6}
    });

    gameActive = false;

    if(winner === "X"){

    xScore++;
    wins++;

    xScoreEl.textContent = xScore;
    winsEl.textContent = wins;

    localStorage.setItem("xScore",xScore);

    statusText.textContent = "You Win 🎉";

    document.getElementById("popupText").textContent =
    "🏆 Congratulations! You Won!";

    document.getElementById("popup").style.display = "flex";
}
    else{

    oScore++;
    losses++;

    oScoreEl.textContent = oScore;
    lossesEl.textContent = losses;

    localStorage.setItem("oScore",oScore);

    statusText.textContent = "Computer Wins 🤖";

    document.getElementById("popupText").textContent =
    "🤖 Computer Won!";

    document.getElementById("popup").style.display = "flex";
}

    function closePopup(){

}
    }

if(!board.includes("")){

    draws++;

    drawsEl.textContent = draws;

    statusText.textContent = "Draw Game 🤝";

    document.getElementById("popupText").textContent =
    "🤝 It's a Draw!";

    document.getElementById("popup").style.display = "flex";

    gameActive = false;

} }


function restartGame(){

    board = ["","","","","","","","",""];

    gameActive = true;

    statusText.textContent = "Your Turn (X)";

    time = 10;
    timer.textContent = 10;

    document.getElementById("popup").style.display = "none";

    cells.forEach(cell=>{
        cell.textContent = "";
        cell.classList.remove("winner");
    });
}

/*timer*/
let time = 10;

const timer =
document.getElementById("timer");

setInterval(()=>{

   if(gameActive){

      time--;

      timer.textContent = time;

      if(time===0){

         aiMove();

         time = 10;
      }
   }

},1000);

function closePopup(){
    document.getElementById("popup").style.display = "none";
}