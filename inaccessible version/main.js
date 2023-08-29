const outcome_element = document.querySelector(".outcome");
const restart_button = document.querySelector(".restart");
const board_element = document.querySelector(".board");

const PLAYER_SYMBOLS = ["X", "O"];
const SIZE = 3;
const CELLS = [];
const PATTERNS = [];
const board = [];

let player_index = 0;
let ended = false;

function init() {
	initialize_board();
	create_cells();
	create_patterns();
	write_player();
}

init();

function initialize_board() {
	for (let i = 0; i < SIZE; i++) {
		board[i] = [];
		for (let j = 0; j < SIZE; j++) {
			board[i][j] = null;
		}
	}
}

function create_cells() {
	board_element.style.setProperty("--size", SIZE);
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			create_cell(i, j);
		}
	}
}

function create_cell(i, j) {
	// issue 1: div is wrong for interactive elements
	const cell = document.createElement("div");
	cell.classList.add("cell");
	board_element.appendChild(cell);
	CELLS.push(cell);
	cell.addEventListener("click", () => handle_click(cell, i, j));
	// issue 2: missing feedback about row and column on focus
	// ---> "add_label" function
}

function write(text, duration) {
	outcome_element.innerText = text;
	if (duration) {
		setTimeout(() => {
			outcome_element.innerText = "";
		}, duration);
	}
}

function write_player() {
	// issue 3: unclear meaning of info
	write(get_player_symbol());
}

function get_player_symbol() {
	return PLAYER_SYMBOLS[player_index];
}

function switch_player() {
	player_index = 1 - player_index;
}

function handle_click(cell, i, j) {
	if (ended || board[i][j] != null) return;
	// issue 4: missing feedback about why nothing happens
	cell.innerText = get_player_symbol();
	board[i][j] = player_index;
	ended = check_ending();
	if (ended) return;
	switch_player();
	write_player();
}

function check_ending() {
	const winning_pattern = PATTERNS.find(is_winning);
	if (winning_pattern) {
		highlight_pattern(winning_pattern);
		write(`${get_player_symbol()} has won!`, 2000);
		return true;
	}

	const filled = board.flat().every((entry) => entry !== null);
	if (filled) {
		// issue 6: information about drawn game only visible for a short amount of time
		write("The game is drawn!", 2000);
		return true;
	}

	return false;
}

function is_winning(pattern) {
	if (pattern.length === 0) return false;
	const [x, y] = pattern[0];
	const value = board[x][y];
	if (value === null) return false;
	const equally_filled = pattern.every(
		([i, j]) => board[i][j] === value
	);
	return equally_filled;
}

function create_patterns() {
	for (let i = 0; i < SIZE; i++) {
		const row = [];
		for (let j = 0; j < SIZE; j++) {
			row.push([i, j]);
		}
		PATTERNS.push(row);
	}
	for (let j = 0; j < SIZE; j++) {
		const col = [];
		for (let i = 0; i < SIZE; i++) {
			col.push([i, j]);
		}
		PATTERNS.push(col);
	}
	const diagonal_1 = [];
	const diagonal_2 = [];
	for (let i = 0; i < SIZE; i++) {
		diagonal_1.push([i, i]);
		diagonal_2.push([i, SIZE - 1 - i]);
	}
	PATTERNS.push(diagonal_1, diagonal_2);
}

function highlight_pattern(pattern) {
	for (const coord of pattern) {
		const [i, j] = coord;
		const cell = CELLS[SIZE * i + j];
		cell.classList.add("highlight");
	}
}

restart_button.addEventListener("click", () => restart_game());

function restart_game() {
	CELLS.forEach((cell) => {
		cell.innerText = "";
		cell.classList.remove("highlight");
	});

	player_index = 0;
	ended = false;
	initialize_board();
	// issue 6: missing feedback about game restart
	write_player();
}
