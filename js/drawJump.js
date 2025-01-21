function drawJump(canvas, ctx) {
  const imageSequence = [];
  const frameCount = 14;
  let currentFrame = 0;
  let lastFrameTime = 0;
  let isPlaying = false;
  const scrollThreshold = 50;
  let clickCount = 0;
  let scrollCount = 0;

  let touchStartY = 0;
  let touchEndY = 0;

  let mouseStartY = 0;
  let mouseEndY = 0;
  let isMouseDown = false;

  let isEnabled = true;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = `../assets/perso-saute/perso1_${String(i).padStart(2, "0")}.png`;

    img.onerror = () => {
      console.error("Problème de chargement pour l'image :", img.src);
    };

    imageSequence.push(img);
  }

  const firstImage = imageSequence[0];
  if (firstImage && firstImage.complete && firstImage.naturalWidth > 0) {
    const ratio = firstImage.naturalWidth / firstImage.naturalHeight;
    const height = canvas.height;
    const width = height * ratio;
    const x = (canvas.width - width) / 2;
    ctx.drawImage(firstImage, x, 0, width, height);
  } else {
    firstImage.onload = () => {
      const ratio = firstImage.naturalWidth / firstImage.naturalHeight;
      const height = canvas.height;
      const width = height * ratio;
      const x = (canvas.width - width) / 2;
      ctx.drawImage(firstImage, x, 0, width, height);
    };
  }

  const playSequence = (time) => {
    if (!ctx || !isPlaying) return;

    if (time - lastFrameTime >= 20) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`${scrollCount}`, 10, 30);

      const image = imageSequence[currentFrame];
      if (image && image.complete && image.naturalWidth > 0) {
        const ratio = image.naturalWidth / image.naturalHeight;
        const height = canvas.height;
        const width = height * ratio;

        const x = (canvas.width - width) / 2;

        ctx.drawImage(image, x, 0, width, height);
      }

      currentFrame++;
      lastFrameTime = time;

      if (currentFrame >= frameCount) {
        isPlaying = false;
        currentFrame = 0;
      }
    }

    if (isPlaying) {
      requestAnimationFrame(playSequence);
    } else if (!isEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startSequence = () => {
    if (isPlaying) return;

    currentFrame = 0;
    isPlaying = true;
    playSequence(0);
  };

  const handleTouchStart = async (event) => {
    if (!isEnabled) return;
    touchStartY = event.touches[0].clientY;
    console.log("Touch start:", touchStartY);
  };

  const handleTouchEnd = (event) => {
    if (!isEnabled) return;
    touchEndY = event.changedTouches[0].clientY;
    console.log("Touch end:", touchEndY);

    const touchDiff = touchStartY - touchEndY;
    console.log("Touch difference:", touchDiff);

    if (Math.abs(touchDiff) >= scrollThreshold) {
      scrollCount++;
      startSequence();
    }
  };

  const handleMouseDown = async (event) => {
    if (!isEnabled) return;
    isMouseDown = true;
    mouseStartY = event.clientY;
    console.log("Mouse start:", mouseStartY);
  };

  const handleMouseUp = (event) => {
    if (!isEnabled) return;
    if (!isMouseDown) return;

    mouseEndY = event.clientY;
    console.log("Mouse end:", mouseEndY);

    const mouseDiff = mouseStartY - mouseEndY;
    console.log("Mouse difference:", mouseDiff);

    if (Math.abs(mouseDiff) >= scrollThreshold) {
      scrollCount++;
      startSequence();
    }

    isMouseDown = false;
  };

  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchend", handleTouchEnd);

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);

  return {
    cleanup: () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      isPlaying = false;
      isEnabled = false;
    },
    enable: () => {
      isEnabled = true;
    },
    getClickCount: () => clickCount,
    getScrollCount: () => scrollCount,
  };
}
