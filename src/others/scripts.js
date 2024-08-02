const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'white', 'orange'];

const fireworks = [];

function random(min, max) {
	return Math.floor((Math.random() * (max - min)) + min);
}

function randomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function randomChoice(array) {
	return array[random(0, array.length)];
}

function render() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (Math.random() < 0.1) {
		fireworks.push(new Firework(random(0, canvas.width - 5), random(400, canvas.height - 5), randomChoice(colors)));
	}

	for (let i = fireworks.length - 1; i >= 0; i--) {
		fireworks[i].update();
		fireworks[i].render(ctx);

		if (!fireworks[i].body.alive && fireworks[i].particles.length === 0) {
			fireworks.splice(i, 1);
		}
	}

	ctx.font = '40px sans-serif';
	ctx.fillText('Happy New Year', canvas.width / 2 - 132, canvas.height / 2 + 10);
	ctx.fillText('Ebriwan!', canvas.width / 2 - 65, canvas.height / 2 + 60);

	ctx.font = '12px sans-serif';
	ctx.fillStyle = 'white';
	ctx.fillText('JP Beyong', canvas.width - 60, 590);
}

ctx.globalAlpha = 0.2;
setInterval(render, 1000 / 40);