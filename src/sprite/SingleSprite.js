class SingleSprite {
	constructor(img) {
		this.img = img;
	}

	draw(ctx, x, y) {
		ctx.drawImage(this.img, x, y);
	}
}