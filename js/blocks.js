/* ==========================================
   BLOCK BLAST PRO
   BLOCK SYSTEM
========================================== */

const blocksContainer =
    document.getElementById("blocks");


/* ==========================================
   COLORS
========================================== */

const COLORS = [
    "#00C2FF",
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#FACC15",
    "#14B8A6",
];


/* ==========================================
   SHAPES
========================================== */

const SHAPES = [

    [[1]],

    [[1,1]],

    [[1],
     [1]],

    [[1,1,1]],

    [[1],
     [1],
     [1]],

    [[1,1],
     [1,1]],

    [[1,0],
     [1,1]],

    [[0,1],
     [1,1]],

    [[1,1,1],
     [0,1,0]],

    [[1,1,1,1]],

    [[1],
     [1],
     [1],
     [1]]

];


/* ==========================================
   RANDOM SHAPE
========================================== */

function randomShape(){

    return SHAPES[
        Math.floor(
            Math.random() * SHAPES.length
        )
    ];

}


/* ==========================================
   RANDOM COLOR
========================================== */

function randomColor(){

    return COLORS[
        Math.floor(
            Math.random() * COLORS.length
        )
    ];

}


/* ==========================================
   CREATE BLOCK
========================================== */

function createBlock(shape){

    const block =
        document.createElement("div");


    block.className =
        "game-block";


    block.draggable =
        false;


    block.dataset.shape =
        JSON.stringify(shape);


    const color =
        randomColor();


    block.dataset.color =
        color;


    const rows =
        shape.length;


    const columns =
        shape[0].length;


    /*
     * CSS controls the actual
     * cell size for desktop/mobile.
     */

    block.style.setProperty(
        "--block-columns",
        columns
    );


    block.style.setProperty(
        "--block-rows",
        rows
    );


    block.style.gridTemplateColumns =
        `repeat(${columns}, var(--block-cell-size, 28px))`;


    block.style.gridTemplateRows =
        `repeat(${rows}, var(--block-cell-size, 28px))`;


    /* ==========================================
       CREATE BLOCK CELLS
    ========================================== */

    shape.forEach(
        (row, rowIndex) => {

            row.forEach(
                (value, colIndex) => {

                    const cell =
                        document.createElement("div");


                    cell.dataset.row =
                        rowIndex;


                    cell.dataset.col =
                        colIndex;


                    cell.className =
                        "block-cell";


                    /* ==================================
                       FILLED TILE
                    ================================== */

                    if(value === 1){

                        /*
                         * TILE TEXTURE
                         * Same texture is also used
                         * on placed board cells.
                         */

                        cell.style.background = `
                            linear-gradient(
                                145deg,
                                rgba(255,255,255,.28) 0%,
                                rgba(255,255,255,.08) 22%,
                                ${color} 45%,
                                ${color} 100%
                            )
                        `;


                        cell.style.boxShadow = `
                            inset 0 2px 3px rgba(255,255,255,.28),
                            inset 0 -3px 5px rgba(0,0,0,.22)
                        `;


                        cell.style.border =
                            "1px solid rgba(255,255,255,.22)";


                        cell.dataset.color =
                            color;

                    }


                    /* ==================================
                       EMPTY SHAPE CELL
                    ================================== */

                    else{

                        cell.classList.add(
                            "block-empty"
                        );

                    }


                    block.appendChild(
                        cell
                    );

                }
            );

        }
    );


    return block;

}


/* ==========================================
   GENERATE 3 BLOCKS
========================================== */

function generateBlocks(){

    if(!blocksContainer){

        return;

    }


    blocksContainer.innerHTML =
        "";


    for(
        let i = 0;
        i < 3;
        i++
    ){

        const shape =
            randomShape();


        const block =
            createBlock(shape);


        blocksContainer.appendChild(
            block
        );

    }

}