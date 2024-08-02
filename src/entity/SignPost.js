class SignPost extends StaticEntity {
	constructor(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
		spriteIDs, responses, isChanging=false, isCollidable=true) {

		super(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
		spriteIDs, responses, isChanging, isCollidable);
	}

	update() {
		if (this.isChanging) {
			if (this.interactingTo) {
				switch (this.interactingTo.facing) {
					case 'left': this.spriteID = 2; break;
					case 'right': this.spriteID = 1; break;
					case 'up': this.spriteID = 0; break;
					case 'down': this.spriteID = 3; break;
				}
			}
			else if (this.spriteID !== 0) this.spriteID = 0;
		}
	}

	draw() {
		if (this.shadowSprite) {
			this.shadowSprite.draw(c, this.cx + this.shadowOffset.x, this.cy + this.shadowOffset.y);
		}
		if (this.isChanging) this.mainSprite.draw(c, this.spriteIDs[this.spriteID],
			this.w, this.h, this.cx, this.cy);
		else this.mainSprite.draw(c, this.cx, this.cy, c);
	}
}