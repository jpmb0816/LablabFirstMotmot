// Check if mobile or not
const MOBILE = /Mobi/.test(navigator.userAgent);
const TILE_SIZE = 64;

const gameConfig = {
	hasMouse: false,
	hasUI: true,
	collisionBox: false
};

// Key code to be used in game and key states
const gameControl = {
	keyState: [],
	ARR_LEFT: 37, // LEFT
	ARR_RIGHT: 39, // RIGHT
	ARR_UP: 38, // UP
	ARR_DOWN: 40, // DOWN
	KEY_A: 65, // A
	KEY_W: 87, // W
	KEY_D: 68, // D
	KEY_S: 83, // S
	KEY_Q: 81, // Q
	KEY_1: 49, // 1
	KEY_2: 50, // 2
	KEY_3: 51, // 3
	KEY_K: 75, // K
	KEY_L: 76, // L
	KEY_V: 86, // V
	KEY_C: 67, // C
	KEY_U: 85, // C
	KEY_ESC: 27, // ESC
	KEY_ENTER: 13 // ENTER
}