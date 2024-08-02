class FPS {
	constructor() {
		this.fps = 0;
		this.count = 1;
		this.frameCount = 0;
		this.lastTime = new Date().getMilliseconds();
	}

	update() {
		const currentTime = new Date().getMilliseconds();

		if (this.lastTime > currentTime) {
			this.fps = this.count;
			this.count = 1;
		}
		else this.count++;

		this.lastTime = currentTime;
		this.frameCount++;
	}

	get() {
		return this.fps;
	}

	getFrameCount() {
		return this.frameCount;
	}
}