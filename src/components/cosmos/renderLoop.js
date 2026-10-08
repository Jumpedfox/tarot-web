// Shared plumbing for the canvas scenes: sizing, the animation loop,
// frame-rate cap, time-based steps and prefers-reduced-motion.

const FRAME_MS = 1000 / 60; // speeds are tuned per 60 Hz frame

export function createRenderLoop(canvas, { maxDpr = 1, maxFps = 60, onResize, onFrame }) {
  let width = 0;
  let height = 0;
  let dpr = 0;

  let rafId = 0;
  let running = false;
  let wanted = false;
  let destroyed = false;
  let lastTime = 0;
  let lastDrawTime = 0;

  const minFrameMs = maxFps ? 1000 / maxFps : 0;

  const reducedMotionQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  const prefersReducedMotion = () => Boolean(reducedMotionQuery?.matches);

  function drawStill() {
    if (width && height) onFrame(0, performance.now());
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;

    const dprChanged = nextDpr !== dpr;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    onResize({ width, height, dpr, dprChanged });

    // Resizing clears the canvas: repaint right away so there is no flash.
    drawStill();
  }

  function frame(time) {
    rafId = requestAnimationFrame(frame);

    // ~2 ms of tolerance so a 60 Hz display never drops to 30 fps.
    if (minFrameMs && time - lastDrawTime < minFrameMs - 2) return;

    // Clamp so coming back from a background tab does not teleport things.
    const dt = lastTime ? Math.min(time - lastTime, 50) : FRAME_MS;
    lastTime = time;
    lastDrawTime = time;

    onFrame(dt / FRAME_MS, time);
  }

  function run() {
    if (destroyed || running) return;
    if (prefersReducedMotion()) {
      drawStill();
      return;
    }
    running = true;
    lastTime = 0;
    lastDrawTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function halt() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  const handleMotionPreference = () => {
    halt();
    if (wanted) run();
    else drawStill();
  };

  const resizeObserver =
    typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(canvas);
  window.addEventListener("resize", resize);
  reducedMotionQuery?.addEventListener?.("change", handleMotionPreference);

  return {
    resize,
    start() {
      wanted = true;
      run();
    },
    stop() {
      wanted = false;
      halt();
    },
    destroy() {
      destroyed = true;
      halt();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      reducedMotionQuery?.removeEventListener?.("change", handleMotionPreference);
    },
  };
}

export const random = (min, max) => Math.random() * (max - min) + min;

export const TAU = Math.PI * 2;

export const makeCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  return canvas;
};
