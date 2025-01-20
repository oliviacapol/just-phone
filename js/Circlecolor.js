export class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.frameCount = 12;
    this.currentFrame = Math.floor(Math.random() * (this.frameCount + 1));
    this.images = [];
    this.loadImages();
    this.frameInterval = 1000 / 15;
    this.lastFrameTime = 0;
  }

  loadImages() {
    for (let i = 0; i <= this.frameCount; i++) {
      const img = new Image();
      img.src = `../assets/bulles/bullebasicbackup/bullebasic${String(
        i
      ).padStart(2, "0")}.png`;
      this.images.push(img);
    }
  }

  draw(ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const currentImage = this.images[this.currentFrame];

    if (
      currentImage &&
      currentImage.complete &&
      currentImage.naturalWidth !== 0
    ) {
      const size = this.radius * 4;
      ctx.drawImage(
        currentImage,
        this.x - size / 2,
        this.y - size / 2,
        size,
        size
      );
    }

    const currentTime = performance.now();
    if (currentTime - this.lastFrameTime > this.frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.lastFrameTime = currentTime;
    }
  }
}
