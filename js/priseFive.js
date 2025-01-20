function priseFive(canvas, ctx, source) {
  const video = document.createElement("video");
  video.src = source;

  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.muted = true;

  video.style.display = "block";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.position = "absolute";
  video.style.top = "0";
  video.style.left = "0";
  video.style.zIndex = "1";
  video.style.objectFit = "cover";

  video.addEventListener("loadedmetadata", () => {
    video.play().catch((err) => console.error("Video playback failed:", err));
  });

  canvas.parentElement.appendChild(video);

  const startTime = Date.now();
  const interval = 1000;

  const intervalId = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    console.log(`Elapsed time: ${elapsedTime}ms`);
  }, interval);
}
