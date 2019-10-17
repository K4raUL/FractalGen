var N;					// number of polygon sides (3 - triangle, 4 - square, ...)
var num = 1;			// number of points to be added to canvas
var c;					// canvas pointer
var cW, cH;				// canvas width and height
var ctx;				// 2D context of canvas
var canvasData; 		// image data of context    
let xV = [];			// X coords of attractor points (first N elements - vertices of polygon, next N*(N-3) - additional attractor points)
let yV = [];			// Y coords of attractor points
var xnew, ynew;			// new point coordinates

document.addEventListener('keydown', function (e) {
    var code = e.keyCode;
    if (code == 13) DrawPoints();
    else if (code == 46) ClearFun();
}, false);

function drawPixel (x, y, r, g, b, a) {
    var index = (Math.round(x) + Math.round(y) * cW) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}        

function ClearFun()
{
	xV = [];
	yV = [];
    ctx.clearRect(0, 0, cW, cH);
    canvasData = ctx.getImageData(0, 0, cW, cH);
    document.getElementById("totalP").innerHTML = N.toString();
	
	DrawInitPolygon();
}

function Format(sender)
{
    var val = sender.value;
    if (sender.id == "sizeP") {
        if (val == NaN || val == null || val == undefined || val < 3) val = 3;
        else if (val > 20) val = 20;
        sender.value = val;
        N = Number(val);
        ClearFun();
    }
    else if (sender.id == "points") {
        if (val == NaN || val == null || val == undefined || val < 1) val = 1;
        sender.value = val;
        num = Number(val);
    }
}

function Init()
{
    N = Number(document.getElementById("sizeP").value);
    c = document.getElementById("myC");
    ctx = c.getContext("2d");

    c.width = window.innerWidth*0.73;
    c.height = window.innerHeight*0.96;
    cW = c.width;
    cH = c.height;
    
    ClearFun();
}

function DrawInitPolygon()
{    
    var an = 180*(N - 2)/N;
    var bn = 180 - an;
    
    var a3 = 60.;
    var b3 = 180 - a3;
    var l3 = 2*0.99*cH*Math.sqrt(3)/3;
    var ln = bn*l3/b3;
	if (N != 3 && N != 4) ln *= 0.86;
    
    var ai = an/2.;
    xV[0] = cW/2.;
    yV[0] = 7.;
	if (N == 4) {
		ln = 0.99*cH;
		xV[0] -= ln/2.;
		ai = an;
	}
    xnew = xV[0];
    ynew = yV[0];

    for (var i = 1; i <= N; i++) {
        xV[i] = xV[i-1] + ln*Math.sin(ai*Math.PI/180.);
        yV[i] = yV[i-1] + ln*Math.cos(ai*Math.PI/180.);
        ai -= bn;
        drawPixel(xV[i], yV[i], 0, 0, 255, 255);
        drawPixel(xV[i], yV[i]+1, 0, 0, 255, 255);
        drawPixel(xV[i], yV[i]-1, 0, 0, 255, 255);
        drawPixel(xV[i]-1, yV[i], 0, 0, 255, 255);
        drawPixel(xV[i]-1, yV[i]+1, 0, 0, 255, 255);
        drawPixel(xV[i]-1, yV[i]-1, 0, 0, 255, 255);
        drawPixel(xV[i]+1, yV[i], 0, 0, 255, 255);
        drawPixel(xV[i]+1, yV[i]+1, 0, 0, 255, 255);
        drawPixel(xV[i]+1, yV[i]-1, 0, 0, 255, 255);
    }
	updateCanvas();

	// filling attractor points vector
	for (var i = 1; i <= N; i++) {
		var dx = (xV[i] - xV[i-1])/(N-2);
		var dy = (yV[i] - yV[i-1])/(N-2);
		for (var j = 1; j <= N-3; j++) {
			xV.push(xV[i-1] + j*dx);
			yV.push(yV[i-1] + j*dy);
		}
	}
	xV.splice(N, 1);
	yV.splice(N, 1);
}

function DrawPoints()
{
    var a = Number(document.getElementById("totalP").innerHTML);
    a += num;
    document.getElementById("totalP").innerHTML = a.toString();
    
    for (var i = 0; i < num; i++) {
        var vx = Math.floor(Math.random() * (N + N*(N - 3)));					// N vertices + N*(N-3) additional attractor points
        xnew = ((N-2)*xV[vx] + xnew)/(N-1);
        ynew = ((N-2)*yV[vx] + ynew)/(N-1);
        drawPixel(xnew, ynew, 0, 0, 255, 255);
    }
    updateCanvas();    
	
	ctx.beginPath();      
	ctx.moveTo(xnew-5, ynew-3);   
	ctx.lineTo(xnew-2, ynew);
	ctx.lineTo(xnew-5, ynew+3);
	ctx.moveTo(xnew-2, ynew);
	ctx.lineTo(xnew-12, ynew);
	ctx.stroke();   	
}
