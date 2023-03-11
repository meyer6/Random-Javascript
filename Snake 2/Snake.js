function Game_State_Display(){
    ctx.fillStyle="#FFFFFF"
    ctx.fillRect(0,0,520,520)
    ctx.fillStyle="#000000"

    for (i=0; i<snake.length; i++){
        ctx.fillRect(snake[i][0]*20,snake[i][1]*20,20,20)
    }
    ctx.fillStyle="#777777"
    ctx.fillRect(apple[0]*20,apple[1]*20,20,20)
}

function Direction(){
    if(keys[65]==true && direction[0]==0){
        direction=[-1,0]
    }else if(keys[68]==true && direction[0]==0){
        direction=[1,0]
    }else if(keys[83]==true && direction[1]==0){
        direction=[0,1]
    }else if(keys[87]==true && direction[1]==0){
        direction=[0,-1]
    }
}
function move(){
    for (i=0; i < snake.length; i++){
        if (snake[i][0] == snake[snake.length-1][0]+direction[0] && snake[i][1] == snake[snake.length-1][0]+direction[1]){
            death = True
        }
    }
    if (death == true || apple[0] == snake[snake.length-1][0]+direction[0] && apple[1] == snake[snake.length-1][0]+direction[1] || snake[snake.length-1][0]+direction[0]<0 || snake[snake.length-1][0]+direction[0]>25 || snake[snake.length-1][0]+direction[1]<0 || snake[snake.length-1][0]+direction[1]>25){
        death = true
    }else{
        snake.push([snake[snake.length-1][0]+direction[0], snake[snake.length-1][1]+direction[1]])
        if (apple[0] == snake[snake.length-1][0] && apple[1] == snake[snake.length-1][1]) {
            apple = [Math.floor(Math.random() * 24), Math.floor(Math.random() * 24)]
        }
        else{
            snake.shift()
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
document.body.addEventListener("keydown", function (e) {
    // if(e.keyCode==32 && death==true){
    //     Variable_Initialize()
    // }
    keys[e.keyCode]=true
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode]=false
});
var canvas = document.getElementById("Screen");
var ctx = canvas.getContext('2d');
var keys=[]
var start = Date.now();
var direction = [1, 0]
var snake = [[5, 5]]
var apple = [Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)]
var death = false
async function gameLoop(){
    if(Date.now()-start>100 && death == false){
        start=Date.now();
        Direction()
        move()
        Game_State_Display()
    }else{
        await sleep(Math.max(100-(Date.now()-start),0));
    }
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);