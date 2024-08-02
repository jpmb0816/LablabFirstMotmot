class AnimationSprite {
	constructor(img, delayPerFrame, sequences, origin) {
		const _imgCol = img.width / TILE_SIZE;
		const _imgRow = img.height / TILE_SIZE;
		const _sequences = sequences ? sequences : new Array(_imgRow);
		const _seqNull = !sequences;

		this.img = img;
		this.spriteID = 0;
		this.origin = origin;
		this.delayPerFrame = delayPerFrame;
		this.at = new Array(_imgRow);
		this.coordinates = new Array(_imgCol * _imgRow);

		for (let y = 0, i = 0; y < _imgRow; y++) {
			if (_seqNull) _sequences[y] = new Array(_imgCol);
			for (let x = 0; x < _imgCol; x++, i++) {
				if (_seqNull) _sequences[y][x] = i;
				this.coordinates[i] = { x: (x * TILE_SIZE), y: (y * TILE_SIZE) };
			}
			this.at[y] = new AnimationThread(this, _sequences[y], origin);
		}
	}

	draw(x, y) {
		const at = this.at[this.spriteID];
		c.drawImage(this.img, this.coordinates[at.index].x, this.coordinates[at.index].y,
			TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
		at.update();
	}

	setSpriteID(spriteID) {
		this.spriteID = spriteID;
	}

	play() {
		this.at[this.spriteID].play();
	}
	
	stop(id) {
		this.at[id].stop();
	}
}