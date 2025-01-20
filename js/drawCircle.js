import { Circle } from "./Circlecolor.js";

export function drawCircle(canvas, ctx, isEnabled = true) {
  if (!isEnabled) return;

  let clickCount = 0;
  const circles = [];
  const maxCircles = 12;
  let timeoutIds = new Set();
  let animationFrameId = null;
  let isPlaying = true;

  const explosionFrames = [];
  const explosionFrameCount = 14;
  const frameDelay = 40;
  const targetFPS = 30;
  const frameInterval = 1000 / targetFPS;
  let lastFrameTime = 0;

  function loadImages(callback) {
    let loadedImages = 0;
    const totalImages = explosionFrameCount + 1;

    for (let i = 0; i <= explosionFrameCount; i++) {
      const img = new Image();
      img.src = `../assets/bulles/bullepop/bullepop${String(i).padStart(
        2,
        "0"
      )}.png`;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) callback();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${img.src}`);
      };
      explosionFrames.push(img);
    }
  }

  function generateCircle() {
    const maxAttempts = 50;
    let attempts = 0;

    while (attempts < maxAttempts) {
      let radius = Math.random() * 30 + 30;
      let x = Math.random() * (canvas.width - 2 * radius) + radius;
      let y = Math.random() * (canvas.height - 2 * radius) + radius;
      let color = "red";
      let circle = new Circle(x, y, radius, color);

      if (circles.length === 0) return circle;

      const overlapping = circles.some((other) => {
        const distance = Math.sqrt(
          (circle.x - other.x) ** 2 + (circle.y - other.y) ** 2
        );
        return distance < circle.radius + other.radius;
      });

      if (!overlapping) return circle;

      attempts++;
    }

    return null;
  }

  function animate(currentTime) {
    if (!isPlaying) return;

    if (currentTime - lastFrameTime < frameInterval) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    lastFrameTime = currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
      if (circle.isExploding) {
        const frameIndex = Math.floor(
          (Date.now() - circle.explosionStart) / frameDelay
        );
        if (frameIndex < explosionFrameCount) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          const size = circle.radius * 2;
          ctx.drawImage(
            explosionFrames[frameIndex],
            circle.x - size,
            circle.y - size,
            size * 2,
            size * 2
          );
        }
      } else {
        circle.draw(ctx);
      }
    });

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`${clickCount}`, 10, 30);
    animationFrameId = requestAnimationFrame(animate);
  }

  loadImages(() => {
    for (let i = 0; i < maxCircles; i++) {
      const circle = generateCircle();
      if (circle) {
        circles.push(circle);
      }
    }

    animate(performance.now());
  });

  const handleInteraction = (e) => {
    if (!isPlaying) return;

    const rect = canvas.getBoundingClientRect();
    const touchX =
      e.type === "click"
        ? e.clientX - rect.left
        : e.touches[0].clientX - rect.left;
    const touchY =
      e.type === "click"
        ? e.clientY - rect.top
        : e.touches[0].clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = touchX * scaleX;
    const canvasY = touchY * scaleY;

    clickCount++;

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const distance = Math.sqrt(
        (canvasX - circle.x) ** 2 + (canvasY - circle.y) ** 2
      );

      if (distance < circle.radius && !circle.isExploding) {
        circle.isExploding = true;
        circle.explosionStart = Date.now();
        circle.currentFrame = 0;

        const id = setTimeout(() => {
          circles.splice(i, 1);
          const newCircle = generateCircle();
          if (newCircle) {
            circles.push(newCircle);
          }
        }, 500);
        timeoutIds.add(id);
        break;
      }
    }
  };

  const eventType = "ontouchstart" in window ? "touchstart" : "click";
  canvas.addEventListener(eventType, handleInteraction);
}
