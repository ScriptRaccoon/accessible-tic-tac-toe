const outcome_element = document.querySelector(".outcome");
const restart_button = document.querySelector(".restart");
const board_element = document.querySelector(".board");
const dialog = document.querySelector(".dialog");
const dialog_text = document.querySelector(".dialog_text");

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
	const cell = document.createElement("button");
	cell.classList.add("cell");
	cell.setAttribute("aria-label", "Empty");
	board_element.appendChild(cell);
	CELLS.push(cell);
	cell.addEventListener("click", () => handle_click(cell, i, j));
	add_description(cell, i, j);
}

function add_description(cell, i, j) {
	const description = document.createElement("div");
	description.innerText = `Row ${i + 1}, Column ${j + 1}`;
	description.id = `d${i},${j}`;
	cell.setAttribute("aria-describedby", description.id);
	description.classList.add("visually-hidden");
	board_element.appendChild(description);
}

function write(text) {
	outcome_element.innerHTML = text;
}

function write_player() {
	write(`Next turn: ${get_player_symbol()}`);
}

function get_player_symbol() {
	return PLAYER_SYMBOLS[player_index];
}

function switch_player() {
	player_index = 1 - player_index;
}

function handle_click(cell, i, j) {
	if (ended) {
		dialog_text.innerText = "The game has already ended";
		dialog.showModal();
		return;
	}
	if (board[i][j] != null) {
		dialog_text.innerText = "The cell is already filled";
		dialog.showModal();
		return;
	}
	cell.innerText = get_player_symbol();
	cell.removeAttribute("aria-label");
	board[i][j] = player_index;
	ended = check_ending();
	if (ended) {
		board_element.classList.add("ended");
		return;
	}
	switch_player();
	write_player();
}

function check_ending() {
	const winning_pattern = PATTERNS.find(is_winning);
	if (winning_pattern) {
		highlight_pattern(winning_pattern);
		dialog_text.innerText = `${get_player_symbol()} has won!`;
		dialog.showModal();
		write("&nbsp;");
		return true;
	}

	const filled = board.flat().every((entry) => entry !== null);
	if (filled) {
		dialog_text.innerText = "The game is drawn!";
		dialog.showModal();
		write("&nbsp;");
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
		cell.setAttribute("aria-label", "Empty");
		cell.classList.remove("highlight");
	});

	player_index = 0;
	ended = false;
	board_element.classList.remove("ended");
	initialize_board();
	write_player();
}
