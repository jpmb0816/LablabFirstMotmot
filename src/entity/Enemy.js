class Enemy extends DynamicEntity {
	constructor(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
		instructions, delayPerFrame, hasD2SCollision=true, hasD2DCollision=true) {
		super(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
			hasD2SCollision, hasD2DCollision, delayPerFrame, sequences);
		
		this.move = {
			left: false,
			up: false,
			right: false,
			down: false
		};

		this.spriteID = 0;

		this.enable = true;
		this.i = 0;
		this.facing = 'down';
		this.message = message;
		this.interactingTo = null;
	}

	update() {
		if (this.enable) {
			this.updateOldPos();
			this.updateMovement();

			this.cx += this.vx;
			this.cy += this.vy;

			this.updateMapPos();

			if (this.vx < 0) {
				this.spriteID = 1;
				this.mainSprite.play(1);
				this.facing = 'left';
			}
			else if (this.vx > 0) {
				this.spriteID = 2;
				this.mainSprite.play(2);
				this.facing = 'right';
			}
			else {
				this.mainSprite.stop(1);
				this.mainSprite.stop(2);
			}

			if (this.vy < 0) {
				this.spriteID = 3;
				this.mainSprite.play(3);
				this.facing = 'up';
			}
			else if (this.vy > 0) {
				this.spriteID = 0;
				this.mainSprite.play(0);
				this.facing = 'down';
			}
			else {
				this.mainSprite.stop(3);
				this.mainSprite.stop(0);
			}
		}
		else {
			this.vx = 0;
			this.vy = 0;

			this.mainSprite.stop(1);
			this.mainSprite.stop(2);

			this.mainSprite.stop(3);
			this.mainSprite.stop(0);
		}

		this.updateInstruction();
		this.updateCurrPos();

		this.d2sCollision();
		this.d2dCollision();

		this.checkBoundaries();
	}

	draw() {
		if (this.x < camera.x + camera.cw && this.x + this.w > camera.x &&
			this.y < camera.y + camera.ch && this.y + this.h > camera.y) {
			
			this.shadowSprite.draw(c, Math.round(this.cx + this.shadowOffset.x), Math.round(this.cy + this.shadowOffset.y));
			this.mainSprite.draw(this.spriteID, Math.round(this.cx), Math.round(this.cy));
		}
		this.update();
	}

	updateInstruction() {
		this.resetMove();

		if (!this.interactingTo) {
			if (this.instructions) {
				const ins = this.instructions[this.i];
				const posX = gridToCoordinate(ins[1]);
				const posY = gridToCoordinate(ins[2]);

				switch (ins[0]) {
					case 'left': this.move.left = true; break;
					case 'up': this.move.up = true; break;
					case 'right': this.move.right = true; break;
					case 'down': this.move.down = true; break;
				}
				
				if (Math.round(this.x - this.mainOffset.x1) === posX &&
					Math.round(this.y - this.mainOffset.y1) === posY) {

					this.i++;
					this.resetMove();
					if (this.i >= this.instructions.length) this.i = 0;
				}
			}
			else this.spriteID = 0;
		}
		else {
			switch (this.interactingTo.facing) {
				case 'left': this.spriteID = 2; break;
				case 'up': this.spriteID = 0; break;
				case 'right': this.spriteID = 1; break;
				case 'down': this.spriteID = 3; break;
			}
		}
	}

	updateMovement() {
		if (this.move.left) {
			this.vx = -this.speed;
			this.vy = 0;
		}
		else if (this.move.up) {
			this.vy = -this.speed;
			this.vx = 0;
		}
		else if (this.move.right) {
			this.vx = this.speed;
			this.vy = 0;
		}
		else if (this.move.down) {
			this.vy = this.speed;
			this.vx = 0;
		}

		if (!this.move.right && !this.move.left) this.vx = 0;
		if (!this.move.down && !this.move.up) this.vy = 0;
	}

	resetMove() {
		this.move.left = false;
		this.move.up = false;
		this.move.right = false;
		this.move.down = false;
	}
}