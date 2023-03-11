function Game_State_Display(){
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,550,550);
    ctx.fillStyle="#000000";
    for(i=0;i<points.length;i++){
        ctx.fillRect(points[i][0]-3,points[i][1]-3,6,6);
    }
    console.log(equation)
    if (equation!=0){
        console.log(equation,Math.abs(equation[1][1]), Math.abs(equation[2][1]), Math.abs(equation[0][1]))
        drawCircle(equation[1][1], equation[2][1], Math.abs(equation[0][1]), "#000000", 2);
    }
}
function Circle_Equation(){
    e1="("+points[0][0].toString()+"-x)^2+("+points[0][1].toString()+"-y)^2=r^2"
    e2="("+points[1][0].toString()+"-x)^2+("+points[1][1].toString()+"-y)^2=r^2"
    e3="("+points[2][0].toString()+"-x)^2+("+points[2][1].toString()+"-y)^2=r^2"
    
    equation = nerdamer.solveEquations([e1, e2, e3]);
}
function drawCircle(x, y, radius, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (stroke) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}
function getXY(canvas, event){
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const x = event.clientX - rect.left;
  return [x,y];
}
document.addEventListener("click",  function (e) {
    if(points.length!=3){
        const XY = getXY(canvas, e);
        points.push([XY[0],XY[1]])
        Game_State_Display();
        if(points.length==3){
            Circle_Equation();
            Game_State_Display();
        }  
    }
});
document.addEventListener("keydown",  function (e) {
    if(e.keyCode==32){
        points=[]
        equation=0
        Game_State_Display();
    }
});
var canvas = document.getElementById("Screen");
var ctx = canvas.getContext('2d');
var points=[]
var equation=0