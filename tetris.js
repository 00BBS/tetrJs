const canv = document.getElementById("tetrjs");
const context = canv.getContext("2d");

context.scale(20, 20);



const T = [
	[0,0,0],
	[1,1,1],
	[0,1,0],
];

const O = [
	[1,1],
	[1,1],
];

const L = [
	[0,1,0],
	[0,1,0],
	[0,1,1],
];

const J = [
	[0,1,0],
	[0,1,0],
	[1,1,0],
];

const Z = [
	[0,0,0],
	[1,1,0],
	[0,1,1],
];

const S = [
	[0,0,0],
	[0,1,1],
	[1,1,0],
];

const I = [
	[0,1,0],
	[0,1,0],
	[0,1,0],
];

const player = {
	pos: {x : 5, y : 5},
	matrix: I
}

function draw(){
	context.fillStyle = '#000';
	context.fillRect(0, 0, canv.width, canv.height);
	drawShape(player.matrix, player.pos, "orange");
}

function drawShape(matrix, offset, colour){
	matrix.forEach((row, y) => {
		row.forEach((value, x) =>{
			if(value !== 0){
				context.fillStyle = colour;
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

var lastTime = 0;
var blockDrop = 0;
var dropInterval = 1000;

function update(time = 0){
	const timeChange = time - lastTime;
	lastTime = time;
	// constantly calls draw
	console.log(timeChange)

	blockDrop += timeChange;
	if(blockDrop > dropInterval){
		player.pos.y++;
		blockDrop = 0;
	}
	draw();
	requestAnimationFrame(update);
}

update();
