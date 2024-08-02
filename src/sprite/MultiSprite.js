class MultiSprite {
	constructor(img, spriteWidth, spriteHeight) {
		this.img = img;
		this.coordinates = [];

		const row = img.height;
		const col = img.width;

		for (let y = 0; y < row; y += spriteHeight) {
			for (let x = 0; x < col; x += spriteWidth) {
				this.coordinates.push({ x: x, y: y });
			}
		}
	}

	draw(ctx, id, sw, sh, dx, dy, dw, dh) {
		if (dw === undefined && dh === undefined) {
			dw = sw;
			dh = sh;
		}
		
		ctx.drawImage(this.img, this.coordinates[id].x, this.coordinates[id].y,
			sw, sh, dx, dy, dw, dh);
	}
}