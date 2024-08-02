class NPC extends DynamicEntity {
	constructor(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
		instructions, delayPerFrame, sequences, responses, hasD2SCollision=false, hasD2DCollision=true) {
		super(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
			hasD2SCollision, hasD2DCollision, delayPerFrame, sequences);
		
		this.instructionID = 0;
		this.instructions = instructions;

		this.responses = responses;
		this.facing = 'down';
		this.moveDirection = '';

		this.enable = true;
		this.isMovingX = false;
		this.isMovingY = false;
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

		this.updateInstruction();
		this.updateCurrPos();

		this.d2sCollision();
		this.d2dCollision();
	}

	draw() {
		this.shadowSprite.draw(c, this.rcx + this.shadowOffset.x, this.rcy + this.shadowOffset.y);
		this.mainSprite.draw(this.rcx, this.rcy);
	}

	updateInstruction() {
		if (this.interactingTo) {
			this.moveDirection = '';
			switch (this.interactingTo.facing) {
				case 'left': this.mainSprite.setSpriteID(2); break;
				case 'right': this.mainSprite.setSpriteID(1); break;
				case 'up': this.mainSprite.setSpriteID(0); break;
				case 'down': this.mainSprite.setSpriteID(3); break;
			}
		}
		else {
			if (this.instructions) {
				const ins = this.instructions[this.instructionID];
				const posX = gridToCoordinate(ins[1]);
				const posY = gridToCoordinate(ins[2]);
				this.moveDirection = ins[0];
				
				if (Math.round(this.x - this.mainOffset.x1) === posX &&
					Math.round(this.y - this.mainOffset.y1) === posY) {

					this.instructionID++;
					this.moveDirection = '';
					if (this.instructionID >= this.instructions.length) this.instructionID = 0;
				}
			}
			else this.mainSprite.setSpriteID(0);
		}
	}

	updateMovement() {
		switch (this.moveDirection) {
			case 'left':
				this.vx = -this.speed;
				this.vy = 0;
				break;
			case 'up':
				this.vy = -this.speed;
				this.vx = 0;
				break;
			case 'right':
				this.vx = this.speed;
				this.vy = 0;
				break;
			case 'down':
				this.vy = this.speed;
				this.vx = 0;
				break;
			default:
				this.vx = 0;
				this.vy = 0;
				break;
		}
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