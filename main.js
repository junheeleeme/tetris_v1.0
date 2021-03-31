
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
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[2, 2], [2, 0], [2, 1], [2, 3]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[2, 2], [2, 0], [2, 1], [2, 3]]
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

// - DOM 
const start_wrap = document.querySelector(".start_wrap");
const start_btn = document.querySelector(".start_btn");
const retry_btn = document.querySelector(".retry_btn");
const board = document.querySelector(".tetris_board>ul");
const stop = document.querySelector(".stop_wrap");
const score_txt = document.querySelector(".score");
const next_board = document.querySelector(".next_block");


// - Variable
const col = 10;
const rows = 20;
let score = 0;
let speed = 800;
let temp_block;
let start;
let arrow_btn = 0;
let esc = 0;
let next_block;

const virtual_block  = {
    form : '',
    direction : 0,
    top : 0,
    left : 3
}


// - functions
function init(){
    esc = 1;
    arrow_btn = 1;
    temp_block = {...virtual_block}; 
    for(let i=0 ; i<rows ; i++){ //테트리스판 행(rows)
        addLine();
    }
    generate_Block(next_block);
}

function addLine(){
    // ul> --> li <-- >ul>li
    const li = document.createElement("li");
    // ul > li > --> ul <-- > li
    const ul = document.createElement("ul");

    for(let j=0 ; j< col ; j++){ //테트리스판 열(column)
        const tetris_block = document.createElement("li"); //테트리스 기본 블록
        ul.prepend(tetris_block); //prepend로 앞에 생성되기 때문에[0]
    }
    li.prepend(ul);
    board.prepend(li); 
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

        const x = block[0] + left; //블록이 이동될 좌표 저장
        const y = block[1] + top; 
        //이동될 좌표에 <li>요소 유무 확인 ↓
        const chk_block = board.children[y] ? board.children[y].children[0].children[x] : null; 
        // ↓ 다음으로 이동 될 좌표에 <li> 요소의 유무와 블록이 존재하는 경우를 체크
        const isAvailable = check_block(chk_block);

        if(isAvailable){
            //해당 위치에 블럭 모양의 클래스이름 추가 및 이동 효과를 위한 moving 클래스 추가
            chk_block.classList.add(form, 'moving'); 

        }else{ //엣지케이스 (좌우범위 이탈과 바닥 터치했을 경우)
                temp_block = {...virtual_block};
                if(edgeCase === 'over'){
                    gameOver();
                }
                setTimeout(()=>{
                    Rendering('over');

                    if(edgeCase === 'top'){ //바닥 터치
                        console.log("바닥 터치!");
                        freezeBlock();  //블록 고정
                    }
                }, 0)
                return true;
            }
    });
    //엣지 케이스에서 되돌리기 위한 이전 값 저장
    virtual_block.top = top;
    virtual_block.left = left;
    virtual_block.direction = direction;
}

function check_block(target){ 
    // ↓ 현재 위치 하단의 <li> 요소의 유무 / 고정된 블록이 존재하는 경우 체크
    if( !target || target.classList.contains('freeze')){
        return false;
    }else{
        return true;
    }    
}

function freezeBlock(){ //바닥에서 블록 고정
    // ↓ 현재 이동중인 moving 클래스를 선언
    const freezeBlock = document.querySelectorAll('.moving');
    
    freezeBlock.forEach(block =>{
        block.classList.replace('moving', 'freeze'); 
    //선언한 moving 클래스를 freeze로 변경하여 기존 블럭 모양은 css로 유지
    })

    clear_Line_check();
}

function clear_Line_check(){ 
    
    const chk_line = board.childNodes; //유사배열보다 배열사용이 용이하여 childNodes사용
    
    chk_line.forEach(Line =>{
        let line_checker = true;

        Line.childNodes[0].childNodes.forEach( block =>{
            if(!block.classList.contains('freeze')){
                line_checker = false;
            }
        })       

        if(line_checker){
                Line.remove();
                addLine();
                score+=10;
                score_txt.innerText = score;
            }                    
        })

        generate_Block(next_block);
}


function generate_Block(next){
    
    clearInterval(start);
    start = setInterval(() => {
        esc = 1;
        moveBlock('top', 1);
    }, speed);
    
    next_block = (Math.random() * 5).toFixed(0);

    const form = Object.keys(blocks)[next_block];
    
    virtual_block.form = form;
    virtual_block.top = 0;
    virtual_block.left = 3;
    virtual_block.direction = 0;
    
    temp_block = {...virtual_block}; 
    Rendering();
    next_rendering(next_block);
};

function next_rendering(next){

    
    const n_block = Object.keys(blocks)[next]; //블록 모양 확인
    const next_block = next_board.querySelectorAll('.next');

    //블록 모양에 따른 랜더링 위치 정렬
    if(n_block === 'tree' || n_block === 'elLeft' || 
        n_block === 'elRight' || n_block === 'zee' ){
        next_board.style.margin = "0 0 0 30px";
    }
    else{
        next_board.style.margin = "0";
    }

    next_block.forEach(next =>{ //클래스 초기화
        next.className = "";
    })

    blocks[n_block][0].forEach(block =>{
        

        const x = n_block === 'squre' ? block[0]+1 : block[0];
        const y = block[1];
        next_board.children[y].children[0].children[x].classList.remove();
        next_board.children[y].children[0].children[x].classList.add(n_block, 'next');
    });
    
    
}

function moveBlock(move_direction, x){ 
    //블록을 움직이기 위해 top, left와 이동값을 인자로 받아 이동 
    temp_block[move_direction]+= x;
        Rendering(move_direction);
}

function changeDirection(){// 블록의 방향을 시계방향으로 움직임
    
    if(temp_block.direction < 3)
        temp_block.direction++;
    else
        temp_block.direction = 0;

    Rendering();
}

function gameStop(){
    clearInterval(start);
    esc = 0;
    stop.style.display = 'block';
}

function dropBlock(){
    clearInterval(start);
    start = setInterval(() => {
        moveBlock('top', 1);
        esc = 1;
    }, 15);
}

function gameOver(){
    clearInterval(start);
    esc = 0;
    arrow_btn = 0;
    document.querySelector(".gameover").style.display = "block";
}

// - EventHandling 이벤트 -
start_btn.addEventListener('click', ()=>{//start
    start_wrap.style.top = "-100%";
    init();
})


document.addEventListener('keydown', e=>{

    const key_chk = esc === 1 ? true : false;

    if(arrow_btn === 1){
        switch(e.keyCode){
            case 27: { //esc
                if(key_chk){
                    gameStop();
                }else{
                    esc = 1;
                    clearInterval(start);
                    start = setInterval(() => {
                    moveBlock('top', 1);
                    }, speed);
                    stop.style.display = 'none';
                }
                break;
            }
            case 32: { //스페이스바
                if(key_chk){
                    dropBlock();
                }
                break;
            }
            case 37: { //오른쪽
                if(key_chk){
                    moveBlock('left', -1);
                }
                break;
            }
            case 39: { //오른쪽
                if(key_chk){
                    moveBlock('left', 1);
                }
                break;
            }
            case 40:{ //아래
                if(key_chk){
                    moveBlock('top', 1);
                }
                break;
            }
            case 38: { //위
                if(key_chk){
                    changeDirection();
                }    
                break;
            }
            default: {
                break;
            }
        }
    }
})

stop.querySelector(".stop_btn").addEventListener('click', ()=>{

    clearInterval(start);
    start = setInterval(() => {
       esc = 1;
       arrow_btn = 1;
       moveBlock('top', 1);
    }, speed);
    stop.style.display = 'none';

})

retry_btn.addEventListener('click', ()=>{

    document.querySelector(".gameover").style.display = "none";
    board.innerHTML = "";
    score = 0;
    score_txt.innerText = score;
    init();

})
