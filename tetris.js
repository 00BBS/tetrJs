const canv = document.getElementById("tetrjs");
const context = canv.getContext("2d");

context.scale(20, 20);

const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const X = 88;

const player = {
	pos: {x : 4, y : 5},
	matrix: null,
	score: 0,
	highScore: 0,
}
// map size: 12 * 20 = 240, 20*20 = 400 === original tetrjs canvas size
const map = drawMatrix(12,20);

var lastTime = 0;
var blockDrop = 0;
var dropInterval = 1000;
var baseScore = 1000;

const colours =  [
  null,
  'purple',
  'yellow',
  'aqua',
  'green',
  'orange',
  'red',
  'blue'
];

var lastKey = -1;

document.addEventListener('keydown', event => {
	event.preventDefault();
	if(event.keyCode === UP){
		playerRotate();
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
	else if(event.keyCode === X){
		player.pos = {x: 5, y: 0};
		player.score = 0;
		updateScore();
		mapReset();
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
		rowClean();
		updateScore();
		updateDrop();
		updateHighScore();
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
				player.score += value;
			}
		});
	});
	updateScore();
	updateHighScore();
	updateDrop();
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
	var rand = Math.floor(Math.random() * 7);
	console.log(rand);
	// set lastKey to -1, to restart rotation cycle
	lastKey = -1; 
	player.matrix = createBlock(blocks[rand]);
	player.pos = {x: 5, y: 0};
	// check if top has been reached
	if(collision(map, player)){
		mapReset();
		// reset score
		player.score = 0;
	}
}

function playerRotate(){
	// rotate

	console.log("last key ===" + lastKey);
	if(lastKey !== UP){
		console.log("here1");
		rotation(player.matrix, 1);
		lastKey = UP;
	}
	else if(lastKey === UP){
		console.log("here2");
		rotation(player.matrix, -1);
		lastKey = -1;
	}
	rotateCollide();
}

function rotateCollide(){
	const playerPos = player.pos.x;
	let offset = -1;

	while(collision(map, player)){
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if(offset > player.matrix[0].length){
			rotation(player.matrix, -1);
			player.pos.x = playerPos;
			return;
		}
	}
}

// transpose, then reverse rows of new matrix
function rotation(matrix, dir){
	for(let y = 0; y < matrix.length; ++y){
		for(let x = 0; x < y; ++x){
			[
				matrix[x][y],
				matrix[y][x],
			] = [
				matrix[y][x],
				matrix[x][y],
			];
		}
	}
	if(dir < 0){
		matrix.reverse;
	}
	else{
		matrix.forEach(row => {
			row.reverse();
		});
	}
}

function rowClean(){
	let rowCount = 1;
	outer: for(let y = map.length - 1; y > 0; --y){
		for(let x = 0; x < map[y].length; ++x){
			if(map[y][x] === 0){
				continue outer;
			}
		}
		// splice of length one, immediately access the first spliced element, and fill with 0.
		const row = map.splice(y, 1)[0].fill(0);
		// push everything down
		map.unshift(row);
		++y;
		player.score += rowCount * 250;
		rowCount *= 2;
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
// increase speed of drop when score is reached
function updateDrop(){
	if(player.score > baseScore){
		baseScore *= 2;
		dropInterval /= 2;
	}
}


function updateScore(){
	document.getElementById("score").innerText = player.score;
}

function updateHighScore(){
	if(player.score > player.highScore){
		player.highScore = player.score;
	}
	document.getElementById("score1").innerText = player.highScore;
}

playerReset();
updateScore();
updateHighScore();
updateDrop();
update();
