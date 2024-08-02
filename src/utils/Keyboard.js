// Log the key event
function keyEventLogger(evt) {
	const keyState = gameControl.keyState;

	if (MOBILE) {
		keyState[gameControl.KEY_A] = false;
		keyState[gameControl.KEY_D] = false;
		keyState[gameControl.KEY_W] = false;
		keyState[gameControl.KEY_S] = false;

		keyState[gameControl.KEY_Q] = false;

		keyState[gameControl.KEY_1] = false;
		keyState[gameControl.KEY_2] = false;
		keyState[gameControl.KEY_3] = false;

		keyState[gameControl.KEY_K] = false;
		keyState[gameControl.KEY_L] = false;

		keyState[gameControl.KEY_V] = false;
		keyState[gameControl.KEY_C] = false;

		keyState[gameControl.ARR_LEFT] = false;
		keyState[gameControl.ARR_RIGHT] = false;
		keyState[gameControl.ARR_UP] = false;
		keyState[gameControl.ARR_DOWN] = false;

		keyState[gameControl.KEY_ESC] = false;
		keyState[gameControl.KEY_ENTER] = false;

		keyState[evt.keyCode] = (evt.type === 'keydown');
	}
	else keyState[evt.keyCode] = (evt.type === 'keydown');

	if (evt.type === 'keydown') {
		// if (keyState[gameControl.KEY_1]) {
		// 	map.load('config/map/MysteriousForest/config.json', 'Teleporting to Mysterious Forest...');
		// }
		// else if (keyState[gameControl.KEY_2]) {
		// 	map.load('config/map/WellSpring/config.json', 'Teleporting to WellSpring...');
		// }
		// else if (keyState[gameControl.KEY_3]) {
		// 	map.load('config/map/EastHaven/config.json', 'Teleporting to EastHaven...');
		// }
		// if (keyState[gameControl.KEY_V]) {
		// 	map.wireframe = !map.wireframe;
		// }
		// else if (keyState[gameControl.KEY_C]) {
		// 	player.speed = (player.speed === 16) ? 1600 : 16;
		// }
		// else if (keyState[gameControl.KEY_U]) {
		// 	gameConfig.hasUI = !gameConfig.hasUI;
		// }
	}
}