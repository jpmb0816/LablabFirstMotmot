class Projectile extends DynamicEntity {
	constructor(from, name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
		facing, speed, delayPerFrame, hasD2SCollision=true, hasD2DCollision=true) {
		super(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
			hasD2SCollision, hasD2DCollision, delayPerFrame, null);

		this.hitSprite = new AnimationSprite(sm.getImage('hit'), 8, null, 0);

		this.from = from;
		this.speed = speed;
		this.dmg = 10;
		this.hasCollide = false;
		this.facing = facing;

		switch (facing) {
			case 'left':
				this.vx = -this.speed;
				this.mainSprite.setSpriteID(1);
				break;
			case 'right':
				this.vx = this.speed;
				this.mainSprite.setSpriteID(2);
				break;
			case 'up':
				this.vy = -this.speed;
				this.mainSprite.setSpriteID(3);
				break;
			case 'down':
				this.vy = this.speed;
				this.mainSprite.setSpriteID(0);
				break;
		}
		this.mainSprite.play();
		this.updateOldPos();

		this.updateMapPos();
		this.updateCurrPos();

		this.d2sCollision();
		this.d2dCollision();

		this.checkBoundaries();
		// this.fireballHit = document.getElementById('fireball-hit');
	}

	update() {
		if (this.hasCollide) {
			if (this.mainSprite === this.hitSprite && !this.mainSprite.at.isPlaying) {
				this.redundant = true;
				// this.fireballHit.cloneNode(true).play();
			}
			else {
				this.mainSprite.setSpriteID(0);
				this.mainSprite.play();

				this.mainSprite = this.hitSprite;
				this.mainOffset = { x1: 0, x2: 0, y1: 0, y2: 0 };
				this.mainSprite.at.stopAtEnd = true;
				this.shadowSprite = null;

				switch (this.facing) {
					case 'left': this.setRight(this.r); break;
					case 'right': this.setLeft(this.l); break;
					case 'up': this.setBottom(this.b); break;
					case 'down': this.setTop(this.t); break;
				}
			}
		}
		else {
			this.updateOldPos();

			this.cx += this.vx;
			this.cy += this.vy;

			this.updateMapPos();
			this.updateCurrPos();

			this.d2sCollision();
			this.d2dCollision();

			this.checkBoundaries();
		}
	}

	draw() {
		if (this.shadowSprite) {
			this.shadowSprite.draw(c, this.rcx + this.shadowOffset.x,
				this.rcy + this.shadowOffset.y);
		}
		this.mainSprite.draw(this.rcx, this.rcy);
	}

	d2sCollision() {
		if (this.hasD2SCollision) {
			map.collisions.forEach(other => {
				if (checkCollision(this, other) && !this.hasCollide) this.hasCollide = true;
			});
		}
	}

	d2dCollision() {
		let wasReallyHitted;

		if (this.hasD2DCollision) {
			map.entities.data.forEach(other => {
				if (other !== this && !(other instanceof Player) && !(other instanceof Projectile)) {
					if (checkCollision(this, other)) wasReallyHitted = other;
				}
			});
		}

		if (wasReallyHitted) {
			this.hasCollide = true;
			wasReallyHitted.hp -= this.dmg;
			if (wasReallyHitted.hp <= 0) wasReallyHitted.redundant = true;
		}
	}
}