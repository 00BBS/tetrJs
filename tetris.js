const canv = document.getElementById("tetrjs");
const context = canv.getContext("2d");

context.scale(20, 20);

const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;

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
	pos: {x : 4, y : 5},
	matrix: I
}
// map size: 12 * 20 = 240, 20*20 = 400 === original tetrjs canvas size
const map = drawMatrix(12,20);

var lastTime = 0;
var blockDrop = 0;
var dropInterval = 1000;



document.addEventListener('keydown', event => {
	event.preventDefault();
	if(event.keyCode === UP){
		// rotate

	}
	else if(event.keyCode === DOWN){
		drop();
	}
	else if(event.keyCode === LEFT){
		playerHShift(-1);
	}
	else if(event.keyCode === RIGHT){
		playerHShift(1);
	}

})

function collision(map, player){
	const [m, o] = [player.matrix, player.pos];
	// iterate along each row
	for(let y = 0; y < m.length; ++y){
		for(let x = 0; x < m[y].length; ++x){
			// if the value of the shape is not 0 and the map exists at that location and is not 0, collide
			if(m[y][x] !== 0 && ((map[y+o.y] && (map[y + o.y][x + o.x])) !== 0)){
				return true;
			}
		}
	}
	return false;
}

function drop(){
	player.pos.y++;
	if(collision(map, player) === true){
		player.pos.y--;
		mergeMatrix(map, player);
		player.pos.y = 0;
	}
	blockDrop = 0;
}

function draw(){
	context.fillStyle = '#000';
	context.fillRect(0, 0, canv.width, canv.height);
	drawShape(player.matrix, player.pos);
}

function drawShape(matrix, offset){
	matrix.forEach((row, y) => {
		row.forEach((value, x) =>{
			if(value !== 0){
				context.fillStyle = "orange";
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

function drawMatrix(w, h){
	const matrix = [];
	while(h > 0){
		h--;
		// for each row, fill the matrix array with a new array of 0's of width w
		matrix.push(new Array(w).fill(0))
	}
	return matrix;
}

function mergeMatrix(map, player){
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){ 
				// copy the value of the player matrix or shape into the map
				// [row][column]
				map[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

// horizontal player shift
function playerHShift(direction){
	player.pos.x += direction;
	if(collision(map, player) === true){
		player.pos.x -= direction;
	}
}

// transpose, then reverse rows of new matrix
function rotation(matrix, dir){
	for()
}

function update(time = 0){
	const timeChange = time - lastTime;
	lastTime = time;
	blockDrop += timeChange;
	if(blockDrop > dropInterval){
		drop();
	}

	// constantly calls draw to update the game
	draw();
	// draw the updated map
	drawShape(map, {x:0, y:0});
	requestAnimationFrame(update);
}

update();
