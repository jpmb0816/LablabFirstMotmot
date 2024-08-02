class SpriteManager {
	constructor() {
		this.names = [];
		this.sprites = [];
	}

	add(name, img) {
		this.names.push(name);
		this.sprites.push(new SingleSprite(img));
	}

	addMultiSprite(name, img, spriteWidth, spriteHeight) {
		this.names.push(name);
		this.sprites.push(new MultiSprite(img, spriteWidth, spriteHeight));
	}

	remove(id) {
		if (!Number.isInteger(id)) id = this.getId(id);
		this.sprites.splice(id, 1);
	}

	draw(ctx, id, x, y) {
		if (!Number.isInteger(id)) id = this.getId(id);
		this.sprites[id].draw(ctx, x, y);
	}

	drawMultiSprite(ctx, src, id, sw, sh, dx, dy, dw, dh) {
		if (!Number.isInteger(src)) src = this.getId(src);
		this.sprites[src].draw(ctx, id, sw, sh, dx, dy, dw, dh);
	}

	getWidth(id) {
		if (!Number.isInteger(id)) id = this.getId(id);
		return this.sprites[id].img.width;
	}

	getHeight(id) {
		if (!Number.isInteger(id)) id = this.getId(id);
		return this.sprites[id].img.height;
	}

	getId(name) {
		for (let i = 0; i < this.names.length; i++) {
			if (this.names[i] === name) return i;
		}
		return -1;
	}
	
	getSprite(id) {
		if (!Number.isInteger(id)) id = this.getId(id);
		return this.sprites[id];
	}
	
	getImage(id) {
		if (!Number.isInteger(id)) id = this.getId(id);
		return this.sprites[id].img;
	}
}