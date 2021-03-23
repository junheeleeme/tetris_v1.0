//blocks
const blocks = { // 각 블록에는 전환했을때 표시할 4개의 모양이 존재 
    tree : [
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[2, 1], [1, 0], [1, 1], [1, 2]],
        [[2, 1], [0, 1], [1, 1], [1, 2]],
        [[0, 1], [1, 2], [1, 1], [1, 0]]
    ],
    squre : [
        [[0,0], [0,1], [1, 0], [1, 1]],
        [[0,0], [0,1], [1, 0], [1, 1]],
        [[0,0], [0,1], [1, 0], [1, 1]],
        [[0,0], [0,1], [1, 0], [1, 1]]
    ],
    bar : [
        [[1, 0], [2, 0], [3, 0], [4, 0]],
        [[2, -1], [2, 0], [2, 1], [2, 2]],
        [[1, 0], [2, 0], [3, 0], [4, 0]],
        [[2, -1], [2,0], [2, 1], [2, 2]]
    ],
    zee : [
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[0, 1], [1, 0], [1, 1], [0, 2]],
        [[0, 1], [1, 1], [1, 2], [2, 2]],
        [[2, 0], [2, 1], [1, 1], [1, 2]]
    ],
    elLeft : [
        [[0, 0], [1, 0], [2, 0], [0, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 0]],
        [[2, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [0, 1], [0, 2], [1, 2]]
    ],
    elRight : [
        [[0, 0], [1, 0], [2, 0], [2, 1]],
        [[2, 0], [2, 1], [2, 2], [1, 2]],
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [1, 2]]
    ]
}

//DOM
const board = document.querySelector(".tetris_board>ul");

//Variable

const col = 10;
const rows = 20;
let score = 0;
let speed = 600;
let temp_block;


const default_block = {
    form : 'tree',
    direction : 0,
    top : 0,
    left : 3
}

//functions

init();

function init(){

    temp_block = {...default_block}; 
    for(let i=0 ; i<rows ; i++){ //테트리스판 행(rows)
        const li = document.createElement("li");
        board.prepend(li); 
        addLine();
    }    

    Rendering();
}

function addLine(){
    const rows_ul = document.createElement("ul"); //테트리스 가로 ul
    board.children[0].prepend(rows_ul);
    for(let j=0 ; j< col ; j++){ //테트리스판 열(column)
        const tetris_block = document.createElement("li"); // 테트리스 기본 블록
        board.children[0].children[0].prepend(tetris_block); //맨 앞에 생성되기 때문에 [0]
    }
}


function Rendering(){

    const {form, direction, top, left} = temp_block;

    const movingBlocks = document.querySelectorAll('.moved');
    // 블록 이동효과를 위해 모든 moved 클래스 선언
    movingBlocks.forEach(moveing =>{
        moveing.classList.remove(form, 'moved'); 
        //개수만큼 moved를 제거해 이동된 자리에 클래스만 남아 css로 블록모양 유지됨
    })

    blocks[form][direction].forEach(block => {
    
        const x = block[0] + left;
        const y = block[1] + top;
            
        board.children[y].children[0].children[x].classList.add(form, 'moved'); 
        //해당 위치에 블럭 모양의 클래스이름 추가 및 이동 효과를 위한 moved 클래스도 추가
    });

}

function moveBlock(move_direction, x){ 
    //블록을 움직이기 위해 top, left와 이동값을 인자로 받아 이동 
    temp_block[move_direction]+= x;
    console.log(temp_block[move_direction])
    Rendering();
}


//eventHandling

document.addEventListener('keydown', e=>{

    switch(e.keyCode){

        case 37: { //오른쪽
            moveBlock('left', -1);
            break;
        }
        case 39: { //오른쪽
            moveBlock('left', 1);
            break;
        }
        case 40:{
            console.log('키보드누름');
            moveBlock('top', 1);
            break;
        }

        default: {
            break;
        }
    }
})


