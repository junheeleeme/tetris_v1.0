//blocks
const blocks = { // 각 블록에는 전환했을때 표시할 4개의 모양이 존재 
    tree : [
        [[0, 1], [2, 1], [1, 0], [1, 1]],
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


const virtual_block  = {
    form : 'tree',
    direction : 0,
    top : 0,
    left : 3
}

//functions

init();

function init(){

    temp_block = {...virtual_block}; 
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
        board.children[0].children[0].prepend(tetris_block); //prepend로 앞에 생성되기 때문에 [0]
    }
}

function Rendering(edgeCase = ''){ // 엣지케이스 구분을 위해 

    const {form, direction, top, left} = temp_block;

    const movingBlocks = document.querySelectorAll('.moving');
    // 블록 이동효과와 엣지 케이스를 위해 moving 클래스를 모두 선언

    movingBlocks.forEach(moveing =>{
        moveing.classList.remove(form, 'moving'); 
        //moving를 제거해 이동된 자리에 클래스만 남아 css로 블록모양이 유지됨
    })


    blocks[form][direction].some(block => {

        const x = block[0] + left; //블록 변동 위치 저장
        const y = block[1] + top; 

        const chk_block = board.children[y] ? board.children[y].children[0].children[x] : null; 
        
        if(check_block(chk_block)){

            //해당 위치에 블럭 모양의 클래스이름 추가 및 이동 효과를 위한 moved 클래스도 추가
            chk_block.classList.add(form, 'moving'); 
            console.log("rending")
        }
        else{
            //엣지케이스..
            if(edgeCase === 'top'){ //내려오다가 걸린경우 블록을 바닥에 고정
                temp_block = {...virtual_block};

                setTimeout(()=>{
                    Rendering();
                    freezeBlock();
                }, 0)
                
                console.log("바닥 터치!");
            }
            else{ // 좌우 영역을 넘어갔을 경우 이전 위치로 재이동
                temp_block = {...virtual_block};
                console.log('좌우 범위 이탈')
                setTimeout(()=>{
                    Rendering();
                }, 0)
            }
        }
        console.log('left : ' + x + ' / Top : ' + y);
    });

    //엣지 케이스에서 되돌리기 위한 이전 값 저장
    virtual_block.top = top;
    virtual_block.left = left;
    virtual_block.direction = direction;
    console.log('-------------------');
}

function check_block(target){ 
    if(target){
        return true;
    }else{
        return false;
    }
}

function freezeBlock(){ //바닥에서 블록 고정
    const freezeBlock = document.querySelectorAll('.moving');
    
    freezeBlock.forEach(block =>{
        block.classList.remove('moving');
        block.classList.add('freeze');
    })

    generate_Block(); //새로운 블록 생성

}

function generate_Block(){
    virtual_block.top = 0;
    virtual_block.left = 3;
    virtual_block.direction = 0;
    temp_block = {...virtual_block}; 
    Rendering();
}

function moveBlock(move_direction, x){ 
    //블록을 움직이기 위해 top, left와 이동값을 인자로 받아 이동 
    temp_block[move_direction]+= x;
        Rendering(move_direction);
}

function changeDirection(){// 블록의 방향을 시계방향으로 움직임
    if(temp_block['direction'] < 3){
        temp_block['direction'] += 1;
    }else{
        temp_block['direction'] = 0;
    }
    console.log(temp_block['direction']);
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
        case 38: {
            changeDirection();
            break;
        }
        default: {
            break;
        }
    }
})


