class Player extends DynamicEntity {
	constructor(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset) {
		super(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset, true, true);
		
		this.health = 100;
		this.maxHealth = 100;
		this.mana = 50;
		this.maxMana = 50;

		this.enable = true;
		this.canSkip = false;
		this.isMovingX = false;
		this.isMovingY = false;
		this.interactingTo = null;

		this.facing = 'down';
		this.speed = 2;
		this.regenCount = 0;
		this.actionCD = 15;
		this.actionCount = this.actionCD;
		this.projectileSpeed = 16;
		// this.fireballWhoosh = document.getElementById('fireball-whoosh');

		// // Shake properties
		// this.shakeEnabled = false;
		// this.shakeCounter = 0;
		// this.shakeAmount = 2;
		// this.shakeSpeed = 5;
		// this.shakeDuration = 20;
		// this.offsetX = 0;
		// this.offsetY = 0;
	}

	update() {
		if (this.enable) {
			this.action();
			this.updateOldPos();
			this.updateMovement();

			this.cx += this.vx;
			this.cy += this.vy;

			this.updateMapPos();

			if (this.vx < 0) {
				if (this.facing !== 'left' || !this.isMovingX) {
					this.mainSprite.setSpriteID(1);
					this.mainSprite.play();
					this.facing = 'left';
					this.isMovingX = true;
				}
			}
			else if (this.vx > 0) {
				if (this.facing !== 'right' || !this.isMovingX) {
					this.mainSprite.setSpriteID(2);
					this.mainSprite.play();
					this.facing = 'right';
					this.isMovingX = true;
				}
			}
			else {
				if (this.isMovingX) {
					this.mainSprite.stop(1);
					this.mainSprite.stop(2);
					this.isMovingX = false;
				}
			}

			if (this.vy < 0) {
				if (this.facing !== 'up' || !this.isMovingY) {
					this.mainSprite.setSpriteID(3);
					this.mainSprite.play();
					this.facing = 'up';
					this.isMovingY = true;
				}
			}
			else if (this.vy > 0) {
				if (this.facing !== 'down' || !this.isMovingY) {
					this.mainSprite.setSpriteID(0);
					this.mainSprite.play();
					this.facing = 'down';
					this.isMovingY = true;
				}
			}
			else {
				if (this.isMovingY) {
					this.mainSprite.stop(3);
					this.mainSprite.stop(0);
					this.isMovingY = false;
				}
			}

			if (!this.isMovingX && !this.isMovingY) {
				this.regenCount++;
				if (this.health < this.maxHealth && this.regenCount % 100 === 0) {
					this.health += Math.floor(this.maxHealth * 0.02);
				}
				if (this.mana < this.maxMana && this.regenCount % 30 === 0) {
					this.mana += Math.floor(this.maxMana * 0.02);
				}
			}
			else if (this.regenCount !== 0) this.regenCount = 0;
		}
		else {
			if (this.isMovingX) {
				this.vx = 0;
				this.mainSprite.stop(1);
				this.mainSprite.stop(2);
				this.isMovingX = false;
			}
			if (this.isMovingY) {
				this.vy = 0;
				this.mainSprite.stop(3);
				this.mainSprite.stop(0);
				this.isMovingY = false;
			}
		}

		this.updateCurrPos();

		this.d2sCollision();
		this.d2dCollision();

		// this.checkBoundaries();
	}

	draw() {
		// if (this.shakeEnabled) {
		// 	this.offsetY = -Math.abs(Math.sin(this.shakeCounter / this.shakeSpeed) * this.shakeAmount);
		// 	this.shakeCounter++;
		// 	if (this.shakeCounter > this.shakeDuration) {
		// 		this.shakeEnabled = false;
		// 		this.shakeCounter = 0;
		// 		this.offsetX = 0;
		// 		this.offsetY = 0;
		// 	}
		// }

		this.shadowSprite.draw(c, this.rcx + this.shadowOffset.x, this.rcy + this.shadowOffset.y);
		this.mainSprite.draw(this.rcx, this.rcy);
	}

	updateMovement() {
		const keyState = gameControl.keyState;

		if (keyState[gameControl.KEY_A]) {
			this.vx = -this.speed;
			this.vy = 0;
		}
		if (keyState[gameControl.KEY_D]) {
			this.vx = this.speed;
			this.vy = 0;
		}
		if (keyState[gameControl.KEY_W]) {
			this.shakeEnabled = true;
			this.vy = -this.speed;
			this.vx = 0;
		}
		if (keyState[gameControl.KEY_S]) {
			this.vy = this.speed;
			this.vx = 0;
		}

		const _condX = (!keyState[gameControl.KEY_A] && !keyState[gameControl.KEY_D]);
		const _condY = (!keyState[gameControl.KEY_W] && !keyState[gameControl.KEY_S]);

		if (_condX) this.vx = 0;
		if (_condY) this.vy = 0;

		if (_condX && _condY) {
			if (keyState[gameControl.ARR_LEFT]) this.setFacing('left');
			if (keyState[gameControl.ARR_RIGHT]) this.setFacing('right');
			if (keyState[gameControl.ARR_UP]) this.setFacing('up');
			if (keyState[gameControl.ARR_DOWN]) this.setFacing('down');
		}
	}

	d2dCollision() {
		if (this.hasD2DCollision && this.enable) {
			// Dynamic entity collision detection
			map.entities.data.forEach(other => {
				if (other !== this && !(other instanceof Projectile)) {
					checkCollision(this, other);

					const al = Math.round(this.l);
					const ar = Math.round(this.r);
					const at = Math.round(this.t);
					const ab = Math.round(this.b);

					const bl = Math.round(other.l);
					const br = Math.round(other.r);
					const bt = Math.round(other.t);
					const bb = Math.round(other.b);

					const collideX = (al < br && ar > bl);
					const collideY = (at < bb && ab > bt);

					const collide = ((this.facing === 'left' && al === br && collideY) ||
						(this.facing === 'up' && at === bb && collideX) ||
						(this.facing === 'right' && ar === bl && collideY) ||
						(this.facing === 'down' && ab === bt && collideX));

					if (!this.interactingTo) {
						if (other.responses && collide && gameControl.keyState[gameControl.KEY_Q]) {
							this.enable = false;
							this.interactingTo = other;

							dialog.setText(other.name, other.responses);

							other.interactingTo = this;
							gameControl.keyState[gameControl.KEY_Q] = false;
						}
					}
				}
			});
		}
		else {
			// Interacting state
			if (this.interactingTo) {
				if (gameControl.keyState[gameControl.KEY_Q]) {
					if (this.canSkip) {
						if (dialog.finished) {
							dialog.reset();
							this.enable = true;
							this.interactingTo.interactingTo = null;
							this.interactingTo = null;
						}
						else dialog.clear();
						this.canSkip = false;
						gameControl.keyState[gameControl.KEY_Q] = false;
					}
					else if (!dialog.canContinue) {
						dialog.index = Math.floor(dialog.index * 1.25);
						if (MOBILE) gameControl.keyState[gameControl.KEY_Q] = false;
					}
				}
				else if (!this.canSkip && dialog.canContinue) {
					this.canSkip = true;
				}
			}
		}
	}

	action() {
		if (gameControl.keyState[gameControl.KEY_K] && this.actionCount === 0) {
			// this.fireballWhoosh.cloneNode(true).play();

			let pjOffset;
			let x, y;

			switch (this.facing) {
				case 'left':
					pjOffset = { x1: 3, x2: 18, y1: 25, y2: 25 };
					x = this.cx - this.w + pjOffset.x2 + 20;
					y = this.cy + 7;
					break;
				case 'right':
					pjOffset = { x1: 18, x2: 3, y1: 25, y2: 25 };
					x = this.cx + this.w - pjOffset.x1 - 20;
					y = this.cy + 7;
					break;
				case 'up':
					pjOffset = { x1: 24, x2: 24, y1: 13, y2: 20 };
					x = this.cx;
					y = this.cy - this.h + pjOffset.y2 + 20;
					break;
				case 'down':
					pjOffset = { x1: 24, x2: 24, y1: 20, y2: 13 };
					x = this.cx;
					y = this.cy + this.h - pjOffset.y1 - 20;
					break;
			}

			map.entities.add(new Projectile(this.name, "Fireball", x, y, 64, 64,
				sm.getImage('fireball'), sm.getSprite('char-shadow'),
				pjOffset, null, this.facing, this.projectileSpeed, 4));

			this.actionCount = this.actionCD;
		}
		if (this.actionCount > 0) this.actionCount--;
	}

	setFacing(facing) {
		this.facing = facing;
		switch (facing) {
			case 'left': this.mainSprite.setSpriteID(1); break;
			case 'right': this.mainSprite.setSpriteID(2); break;
			case 'up': this.mainSprite.setSpriteID(3); break;
			case 'down': this.mainSprite.setSpriteID(0); break;
		}
	}
}