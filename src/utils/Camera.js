class Camera {
	constructor(ctx, cw, ch) {
		this.ctx = ctx;
		this.cw = cw;
		this.ch = ch;
		this.mw = 0;
		this.mh = 0;
		this.x = 0;
		this.y = 0;
		this.bindedTo = null;
	}

	setMapSize(w, h) {
		this.mw = w;
		this.mh = h;
	}

	// Update camera based on x and y
	update() {
		const entity = this.bindedTo;
		const x = entity.rcx + entity.w / 2;
		const y = entity.rcy + entity.h / 2;

		// Camera x and y
		const vx = -x + this.cw / 2;
		const vy = -y + this.ch / 2;

		// Clamping camera x and y so it prevents going out of map
		this.x = clamp(vx, -(this.mw - this.cw), 0);
		this.y = clamp(vy, -(this.mh - this.ch), 0);

		// Translate canvas base on camera x and y
		this.ctx.translate(this.x, this.y);

		// Update camera x and y and make it absolute value
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
	}

	bind(entity) {
		if (!entity) console.error('Cannot bind the camera to null entity.');
		else if (entity instanceof Entity) this.bindedTo = entity;
		else console.error('Cannot bind the camera to non-entity.');
	}

	stop() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
}