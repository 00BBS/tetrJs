const canv = document.getElementById("tetrjs");
const context = canv.getContext("2d");

context.scale(20, 20);

const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;

const player = {
	pos: {x : 4, y : 5},
	matrix: createBlock("I")
}
// map size: 12 * 20 = 240, 20*20 = 400 === original tetrjs canvas size
const map = drawMatrix(12,20);

var lastTime = 0;
var blockDrop = 0;
var dropInterval = 1000;

const colours =  [
  null,
  'purple',
  'yellow',
  'orange',
  'blue',
  'aqua',
  'green',
  'red'
];


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

function createBlock(type){
	if(type === 'T'){
		return [
			[0,0,0],
			[1,1,1],
			[0,1,0],
		];
	}
	if(type === 'O'){
		return [
			[2,2],
			[2,2],
		];
	}
	if(type === 'S'){
		return [
			[0,0,0],
			[0,3,3],
			[3,3,0],
		];
	}
	if(type === 'Z'){
		return [
			[0,0,0],
			[4,4,0],
			[0,4,4],
		];
	}
	if(type === 'J'){
		return [
			[0,5,0],
			[0,5,0],
			[5,5,0],
		];
	}
	if(type === 'L'){
		return [
			[0,6,0],
			[0,6,0],
			[0,6,6],
		];
	}
	if(type === 'I'){
		return [
			[0,7,0,0],
			[0,7,0,0],
			[0,7,0,0],
			[0,7,0,0],
		];
	}
}

function drop(){
	player.pos.y++;
	if(collision(map, player) === true){
		player.pos.y--;
		mergeMatrix(map, player);
		playerReset();
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
				context.fillStyle = colours[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}
// reset map function
function mapReset(){
	map.forEach(row => {
		row.fill(0);
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


function playerReset(){
	const blocks = "ILJOTSZ";
	var rand = Math.floor(Math.random() * 6) + 1;
	player.matrix = createBlock(blocks[rand]);
	player.pos = {x: 5, y: 0};
	// check if top has been reached
	if(collision(map, player)){
		mapReset();
	}
}

// transpose, then reverse rows of new matrix
function rotation(matrix, dir){
	for(let y = 0; y < matrix.length; ++y){
		for(let x = 0; x < y; ++x){

		}
	}
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
