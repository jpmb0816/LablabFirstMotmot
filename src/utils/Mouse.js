const mouse = {
	x: 0,
	y: 0,
	hasClick: false
}

function updateMouse(evt) {
	mouse.x = evt.clientX;
	mouse.y = evt.clientY;
}

function updateMouseClick(evt) {
	mouse.hasClick = (evt.type === 'mousedown') ? true : false;
}