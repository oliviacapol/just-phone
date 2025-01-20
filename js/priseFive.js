function priseFive(canvas, ctx, source) {
  const video = document.createElement("video");
  video.src = source;

  video.onerror = function () {
    console.error("Error loading video source:", source);
  };

  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.muted = true;

  const attemptPlay = async () => {
    try {
      await video.play();
    } catch (err) {
      console.log("Autoplay prevented - waiting for user interaction");
      const playButton = document.createElement("button");
      playButton.textContent = "Play Video";
      playButton.style.position = "absolute";
      playButton.style.zIndex = "2";
      playButton.onclick = () => {
        video.play();
        playButton.remove();
      };
      canvas.parentElement.appendChild(playButton);
    }
  };

  video.style.display = "block";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.position = "absolute";
  video.style.top = "0";
  video.style.left = "0";
  video.style.zIndex = "1";
  video.style.objectFit = "cover";

  video.addEventListener("loadedmetadata", () => {
    attemptPlay();
  });

  canvas.parentElement.appendChild(video);

  const startTime = Date.now();
  const interval = 1000;

  const intervalId = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    console.log(`Elapsed time: ${elapsedTime}ms`);
  }, interval);
}
