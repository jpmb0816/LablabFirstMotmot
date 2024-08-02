class DynamicEntity extends Entity {
	constructor(name, x, y, w, h, mainSprite, shadowSprite, mainOffset, shadowOffset,
		hasD2SCollision, hasD2DCollision, delayPerFrame=12, sequences=null) {
		super(x, y, w, h);

		this.name = name;

		this.mainSprite = new AnimationSprite(mainSprite, delayPerFrame, sequences, 1);
		this.shadowSprite = shadowSprite;
		this.mainOffset = !mainOffset ? { x1: 0, x2: 0, y1: 0, y2: 0 } : mainOffset;
		this.shadowOffset = !shadowOffset ? { x: 0, y: 0 } : shadowOffset;
			
		this.hasD2SCollision = hasD2SCollision;
		this.hasD2DCollision = hasD2DCollision;

		this.vx = 0;
		this.vy = 0;
		this.speed = 2;
		this.canUpdateOldPos = true;
	}

	updateMapPos() {
		this.x = this.cx + this.mainOffset.x1;
		this.y = this.cy + this.mainOffset.y1;
		this.rcx = Math.round(this.cx);
		this.rcy = Math.round(this.cy);
	}

	updateOldPos() {
		if (this.canUpdateOldPos) {
			this.ol = this.l;
			this.or = this.r;
			this.ot = this.t;
			this.ob = this.b;
		}
	}

	updateCurrPos() {
		this.l = this.x;
		this.r = this.cx + this.w - this.mainOffset.x2;
		this.t = this.y;
		this.b = this.cy + this.h - this.mainOffset.y2;
		this.canUpdateOldPos = true;
	}

	checkBoundaries() {
		if (this.l < 0) this.setLeft(0);
		else if (this.r > map.width) this.setRight(map.width);

		if (this.t < 0) this.setTop(0);
		else if (this.b > map.height) this.setBottom(map.height);
	}

	d2sCollision() {
		if (this.hasD2SCollision) {
			map.collisions.forEach(other => checkCollision(this, other));
		}
	}

	d2dCollision() {
		if (this.hasD2DCollision) {
			map.entities.data.forEach(other => {
				if (other !== this && !(other instanceof Projectile)) checkCollision(this, other);
			});
		}
	}

	setCX(n) {
		this.cx = n;
	}

	setCY(n) {
		this.cy = n;
	}

	setX(n) {
		this.cx = n - this.mainOffset.x1;
		this.x = this.cx;
	}

	setY(n) {
		this.cy = n - this.mainOffset.y1;
		this.y = this.cy;
	}

	setLeft(n) {
		this.cx = n - this.mainOffset.x1;
		this.updateMapPos();
		this.updateCurrPos();
	}

	setRight(n) {
		this.cx = n - this.w + this.mainOffset.x2;
		this.updateMapPos();
		this.updateCurrPos();
	}

	setTop(n) {
		this.cy = n - this.mainOffset.y1;
		this.updateMapPos();
		this.updateCurrPos();
	}

	setBottom(n) {
		this.cy = n - this.h + this.mainOffset.y2;
		this.updateMapPos();
		this.updateCurrPos();
	}
}