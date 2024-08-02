class FontSprite {
  constructor(charWidth, charHeight) {
    this.fontNames = [];
    this.images = [];
    this.charWidth = charWidth;
    this.charHeight = charHeight;
  }

  add(name, image) {
    this.fontNames.push(name);
    this.images.push(image);
  }

  drawText(ctx, text, fontName, x, y, lineLimit, cleanFirst = false) {
    if (!ctx) ctx = c;
    text = text.toUpperCase();

    const w = this.charWidth;
    const h = this.charHeight;
    const fontID = this.getFontID(fontName);

    for (
      let i = 0,
        row = 0,
        col = 0,
        len = text.length,
        tw = w * lineLimit,
        lm = lineLimit - 1;
      i < len;
      i++, col++
    ) {
      const id = text.charCodeAt(i) - 32;
      const currX = x + col * w;
      const currY = y + row * h;

      if (cleanFirst && col === 0)
        ctx.clearRect(
          currX * gameSizeMultiplier,
          currY * gameSizeMultiplier,
          tw * gameSizeMultiplier,
          h * gameSizeMultiplier
        );
      if (id !== 0) {
        ctx.drawImage(
          this.images[fontID],
          id * w,
          0,
          w,
          h,
          currX * gameSizeMultiplier,
          currY * gameSizeMultiplier,
          w * gameSizeMultiplier,
          h * gameSizeMultiplier
        );
      }
      if (col === lm) {
        row++;
        col = -1;
      }
    }
  }

  drawText2(ctx, text, fontName, x, y, lineLimit, cleanFirst = false) {
    if (!ctx) ctx = c;
    text = text.toUpperCase();

    const w = this.charWidth;
    const h = this.charHeight;
    const fontID = this.getFontID(fontName);

    for (
      let i = 0,
        row = 0,
        col = 0,
        len = text.length,
        tw = w * lineLimit,
        lm = lineLimit - 1;
      i < len;
      i++, col++
    ) {
      const id = text.charCodeAt(i) - 32;
      const currX = x + col * (w*gameSizeMultiplier);
      const currY = y + row * (h*gameSizeMultiplier);

      if (cleanFirst && col === 0) ctx.clearRect(currX, currY, tw, h);
      if (id !== 0) {
        ctx.drawImage(
          this.images[fontID],
          id * w,
          0,
          w,
          h,
          currX,
          currY,
          w*gameSizeMultiplier,
          h*gameSizeMultiplier
        );
      }
      if (col === lm) {
        row++;
        col = -1;
      }
    }
  }

  drawTextInRange(ctx, text, fontName, x, y, lineLimit, end, lastPosition) {
    const start = lastPosition.index;

    if (start < end) {
      text = text.toUpperCase();
      const fontID = this.getFontID(fontName);
      const w = this.charWidth;
      const h = this.charHeight;

      let row = lastPosition.row;
      let col = lastPosition.col;
      let i;

      for (i = start; i < end; i++, col++) {
        const id = text.charCodeAt(i) - 32;

        if (id !== 0) {
          const currX = col * w + x;
          const currY = row * h + y;
          ctx.drawImage(
            this.images[fontID],
            id * w,
            0,
            w,
            h,
            currX * gameSizeMultiplier,
            currY * gameSizeMultiplier,
            w * gameSizeMultiplier,
            h * gameSizeMultiplier
          );
        }
        if (col === lineLimit - 1) {
          row++;
          col = -1;
        }
      }
      return { row: row, col: col, index: i };
    }
    return lastPosition;
  }

  getFontID(fontName) {
    const len = this.fontNames.length;
    for (let i = 0; i < len; i++) {
      if (this.fontNames[i] === fontName) return i;
    }
    return -1;
  }
}
