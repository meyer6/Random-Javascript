function Game_State_Display(){
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,550,550);
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(5,5,540,540);
    ctx.strokeStyle="#000000";
    if(done==false){
        ctx.fillStyle="#FF0000";
    }else{
       ctx.fillStyle="#FFFFFF"; 
    }
    ctx.lineWidth = 1;
    if(lines.length>=2){
        ctx.beginPath();
        ctx.moveTo(lines[0][0], lines[0][1]);
    }
    for(i=0;i<lines.length-1;i++){
        ctx.lineTo(lines[i+1][0], lines[i+1][1]);
    }
    if(done==false){
        ctx.lineWidth = 3;
    }
    ctx.stroke();
    if(draw==false){
        ctx.closePath();
        ctx.fill();
    }
    if(lines.length!=0 && draw==true){
        ctx.beginPath();
        ctx.moveTo(lines[lines.length-1][0], lines[lines.length-1][1]);
        ctx.lineTo(mouse[0], mouse[1]);
        ctx.stroke();
    }
    for(i=0;i<circles.length;i++){
        if(done==false){
            drawCircle(circles[i][1], circles[i][2], circles[i][0], "#FFFFFF", "#000000", 0);
        }else{
            drawCircle(circles[i][1], circles[i][2], circles[i][0], "#FFFFFF", "#000000", 1);
        }
    }
}
function Pythagoras(x,y){
    return (x**2+y**2)**(1/2)
}
function Shortest_Difference(x,y){
    var shortest = 1000;
    for(i=0;i<line_equations.length;i++){
        var a=line_equations[i][0];
        var c=line_equations[i][1];
        var distance=Math.abs((a*x+y+c)/(a**2+1)**(1/2));
        var d=Pythagoras(distance,Pythagoras(lines[i][0]-lines[i+1][0],lines[i][1]-lines[i+1][1]))
        if(d<Pythagoras(x-lines[i][0],y-lines[i][1]) || d<Pythagoras(x-lines[i+1][0],y-lines[i+1][1])){
            distance=Pythagoras(x-lines[i][0],y-lines[i][1])
            if(distance<shortest){
                shortest=distance;
            }
            distance=Pythagoras(x-lines[i+1][0],y-lines[i+1][1])
            if(distance<shortest){
                shortest=distance;
            }
        }
        if(distance<shortest){
            shortest=distance;
        }
    }
    for(i=0;i<circles.length;i++){
        var distance=((circles[i][1]-x)**2+(circles[i][2]-y)**2)**(1/2)-circles[i][0]
        if(distance<shortest){
            shortest=distance;
        }
    }
    return shortest;
}
function Equations(x1,y1,x2,y2){
    var m=(y2-y1)/(x2-x1);
    var c=y1-m*x1;
    line_equations.push([-1*m,-1*c]);
}
function Biggest_Circle(x,y){
    var distances=[];
    for(x1=-1;x1<=1;x1++){
        for(y1=-1;y1<=1;y1++){
            var imgData = ctx.getImageData(x+x1, y+y1, 1, 1);
            imgData=rgbToHex(imgData.data[0],imgData.data[1],imgData.data[2]);
            if(imgData!="#ffffff" && imgData!="#000000"){
                distances.push([Shortest_Difference(x+x1, y+y1),x+x1, y+y1]);
            }            
        }       
    }
    var longest=[0,0];
    for(i=0;i<distances.length;i++){
        if(distances[i][0]>longest[0]){
            longest[0]=distances[i][0];
            longest[1]=i;
        }
    }
    if(distances[longest[1]][1]==x && distances[longest[1]][2]==y){
        circles.push(distances[longest[1]]);
    }else{
        Biggest_Circle(distances[longest[1]][1],distances[longest[1]][2])
    }
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function drawCircle(x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getXY(canvas, event){
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const x = event.clientX - rect.left;
  return [x,y];
}
document.addEventListener("click",  function (e) {
    const XY = getXY(canvas, e);
    if(XY[0]>5 && XY[0]<545 && XY[1]>5 && XY[1]<545){
        if(draw==true){
            if(lines.length!=0 && Math.abs(XY[0]-lines[0][0])<10 && Math.abs(XY[1]-lines[0][1])<10){
                lines.push([lines[0][0],lines[0][1]]);
                draw=false;
                for(i=0;i<lines.length-1;i++){
                    Equations(lines[i][0],lines[i][1],lines[i+1][0],lines[i+1][1]);
                }
                var start2=Date.now()
                while(Date.now()-start2<3000){
                    Game_State_Display();
                    var x = Math.floor(Math.random()*550);
                    var y = Math.floor(Math.random()*550);
                    var imgData = ctx.getImageData(x, y, 1, 1);
                    imgData=rgbToHex(imgData.data[0],imgData.data[1],imgData.data[2]);
                    while(imgData!="#ff0000" && Date.now()-start2<3000){
                        var x = Math.floor(Math.random()*550);
                        var y = Math.floor(Math.random()*550);
                        var imgData = ctx.getImageData(x, y, 1, 1);
                        imgData=rgbToHex(imgData.data[0],imgData.data[1],imgData.data[2]);                    
                    }
                    if(Date.now()-start2<3000){
                        Biggest_Circle(x,y);
                    }
                }
                done=true
            }else{
                lines.push([XY[0],XY[1]]);
            }
        }
        mouse=[XY[0],XY[1]];
        Game_State_Display();
    }
});
document.addEventListener("mousemove",  function (e) {
    const XY = getXY(canvas, e);
    mouse=[XY[0],XY[1]];
    Game_State_Display();
});
var canvas = document.getElementById("Screen");
var ctx = canvas.getContext('2d');
var lines=[];
var line_equations=[];
var mouse=[0,0];
var circles=[];
var draw=true;
var done=false;