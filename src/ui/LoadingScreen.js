class LoadingScreen {
  constructor(map) {
    this.map = map;
    this.alpha = 1;
    this.done = false;
    this.delayStarted = false;
    this.delayStartTime = null;
  }

  displayIfDone(ctx, func) {
    if (this.map.isLoaded) {
      if (this.done || this.alpha !== 0) {
        this.done = false;
        ctx.globalAlpha = 1;
      }

      func();

      if (this.alpha === 0) {
        this.done = true;
      } else if (this.alpha > 0) {
        if (!this.delayStarted) {
          this.delayStarted = true;
          this.delayStartTime = Date.now();
        }

        const elapsedTime = (Date.now() - this.delayStartTime) / 1000; // Elapsed time in seconds

        if (elapsedTime >= 2) {
          ctx.globalAlpha = this.alpha;
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
          this.alpha -= 0.02;
        } else {
          // During the delay, keep the alpha fully opaque
          ctx.globalAlpha = 1;
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);

		  ctx.font = "30px Arial";
		  ctx.fillStyle = "white";
		  ctx.fillText(this.map.status, 20, height - 50);
        }
      }
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(this.map.status, 20, height - 50);
    }
  }

  reset(ctx) {
    ctx.globalAlpha = 1;
    this.alpha = 1;
    this.done = false;
    this.delayStarted = false;
    this.delayStartTime = null;
  }
}
