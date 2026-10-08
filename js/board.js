/* ==========================================
   BLOCK BLAST PRO
   BOARD SYSTEM
========================================== */

const BOARD_SIZE = 8;

const boardElement =
    document.getElementById("board");

let board = [];

let boardCells = [];


/* ==========================================
   CREATE BOARD DATA
========================================== */

function initializeBoard(){

    board = [];

    for(
        let row = 0;
        row < BOARD_SIZE;
        row++
    ){

        board[row] = [];

        for(
            let col = 0;
            col < BOARD_SIZE;
            col++
        ){

            board[row][col] = 0;

        }

    }

}


/* ==========================================
   CREATE BOARD HTML
========================================== */

function renderBoard(){

    boardElement.innerHTML = "";

    boardCells = [];

    for(
        let row = 0;
        row < BOARD_SIZE;
        row++
    ){

        boardCells[row] = [];

        for(
            let col = 0;
            col < BOARD_SIZE;
            col++
        ){

            const cell =
                document.createElement("div");


            cell.className =
                "cell";


            cell.dataset.row =
                row;


            cell.dataset.col =
                col;


            boardElement.appendChild(
                cell
            );


            boardCells[row][col] =
                cell;

        }

    }

}


/* ==========================================
   GET BOARD CELL
========================================== */

function getBoardCell(row, col){

    if(
        row < 0 ||
        row >= BOARD_SIZE ||
        col < 0 ||
        col >= BOARD_SIZE
    ){

        return null;

    }


    return boardCells[row]?.[col] || null;

}


/* ==========================================
   UPDATE BOARD
========================================== */

function updateBoard(){

    for(
        let row = 0;
        row < BOARD_SIZE;
        row++
    ){

        for(
            let col = 0;
            col < BOARD_SIZE;
            col++
        ){

            const cell =
                boardCells[row]?.[col];


            if(!cell){

                continue;

            }


            const value =
                board[row][col];


            /* ==================================
               EMPTY CELL
            ================================== */

            if(!value){

                cell.classList.remove(
                    "filled"
                );


                cell.style.background =
                    "";


                cell.style.boxShadow =
                    "";


                cell.style.border =
                    "";


                cell.style.borderColor =
                    "";


                cell.removeAttribute(
                    "data-color"
                );


                continue;

            }


            /* ==================================
               FILLED CELL
            ================================== */

            cell.classList.add(
                "filled"
            );


            /*
             * Supports both:
             *
             * 1
             *
             * and:
             *
             * {
             *     value: 1,
             *     color: "#..."
             * }
             */

            let color =
                "#3B82F6";


            if(
                typeof value === "object" &&
                value !== null
            ){

                color =
                    value.color ||
                    "#3B82F6";

            }


            cell.dataset.color =
                color;


            /* ==================================
               SAME TILE TEXTURE AS TRAY
            ================================== */

            cell.style.background = `
                linear-gradient(
                    145deg,
                    rgba(255,255,255,.28) 0%,
                    rgba(255,255,255,.08) 22%,
                    ${color} 45%,
                    ${color} 100%
                )
            `;


            /* ==================================
               TILE DEPTH
            ================================== */

            cell.style.boxShadow = `
                inset 0 2px 3px rgba(255,255,255,.28),
                inset 0 -3px 5px rgba(0,0,0,.22)
            `;


            /* ==================================
               TILE BORDER
            ================================== */

            cell.style.border =
                "1px solid rgba(255,255,255,.22)";

        }

    }

}


/* ==========================================
   START
========================================== */

function setupBoard(){

    initializeBoard();

    renderBoard();

    updateBoard();

}