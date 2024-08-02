class DialogBox {
  constructor(fontSprite, lineLimit) {
    this.fontSprite = fontSprite;
    this.name = "";
    this.text = [];
    this.textID = 0;
    this.index = 1;
    this.count = 0;
    this.countCD = 2;
    this.visible = false;
    this.finished = false;
    this.canContinue = false;
    this.canDrawAuthor = true;
    this.canDrawText = true;
    this.lineLimit = lineLimit;
    this.lastPosition = { row: 0, col: 0, index: 0 };
  }

  display() {
    if (this.visible) {
      c.drawImage(
        dialogCanvas,
        0 * gameSizeMultiplier,
        340 * gameSizeMultiplier
      );
      this.drawAuthorOnce();
      const len = this.text[this.textID].length;

      if (!this.canContinue && this.index >= len) {
        this.index = len;
        this.canContinue = true;
        this.drawText();

        if (this.textID === this.text.length - 1) {
          this.finished = true;
        } else this.textID++;
      }

      if (!this.canContinue && this.index < len) {
        this.drawText();
        if (this.count === this.countCD) {
          this.index++;
          this.count = 0;
        }
        if (this.count < this.countCD) this.count++;
      }
    }
  }

  drawAuthorOnce() {
    if (this.canDrawAuthor) {
      this.fontSprite.drawText(
        dialogCtx,
        this.name,
        "red",
        60,
        40,
        this.lineLimit
      );
      this.canDrawAuthor = false;
    }
  }

  drawText() {
    this.lastPosition = this.fontSprite.drawTextInRange(
      dialogCtx,
      this.text[this.textID],
      "white",
      60,
      60,
      this.lineLimit,
      this.index,
      this.lastPosition
    );
  }

  clear() {
    this.index = 1;
    this.canContinue = false;
    this.canDrawAuthor = true;
    this.lastPosition = { row: 0, col: 0, index: 0 };
    dialogCtx.clearRect(0, 0, 620 * gameSizeMultiplier, 170 * gameSizeMultiplier);
    dialogCtx.drawImage(
      sm.getImage("dialog-box"),
      0,
      1100,
      1200,
      275,
      20 * gameSizeMultiplier,
      0 * gameSizeMultiplier,
      600 * gameSizeMultiplier,
      170 * gameSizeMultiplier
    );
  }

  reset() {
    this.name = "";
    this.text = [];
    this.textID = 0;
    this.visible = false;
    this.finished = false;
    this.clear();
  }

  setText(name, text) {
    this.name = name;
    this.text = text;
    this.visible = true;
  }
}
