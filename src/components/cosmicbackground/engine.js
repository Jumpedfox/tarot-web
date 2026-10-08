// Canvas engine for the animated "black hole" background.
//
// Framework-free on purpose: the React component only mounts it, and it can
// later be moved into a Web Worker with OffscreenCanvas without changes to the
// drawing code.
//
// Compared to the original wallpaper.html it keeps the same look, but:
// - everything that never changes (atmosphere, halo, sphere, glowing rim) is
//   rendered once into sprites and blitted with drawImage every frame;
// - every gas cloud is pre-rendered into its own sprite (72 radial gradients
//   per frame -> 12 drawImage calls);
// - stars are batched by quantized alpha / line width: ~50 draw calls per
//   frame instead of ~2100, and no rgba() strings are allocated per frame;
// - motion is time-based (same speed on 60/120/144 Hz) and capped at maxFps;
// - backing store is rendered at maxDpr (1 by default) since the scene is soft;
// - respects prefers-reduced-motion (renders a single still frame).

const SPHERE_RADIUS = 62;
const TAU = Math.PI * 2;
const FRAME_MS = 1000 / 60; // the original tuned its speeds per 60 Hz frame

const ALPHA_LEVELS = 12;
const WIDTH_LEVELS = 3;
const MIN_LINE_WIDTH = 0.3;
const WIDTH_STEP = 0.26;

const DEFAULTS = {
  starCount: 700,
  gasCount: 12,
  maxDpr: 1,
  maxFps: 60,
};

const random = (min, max) => Math.random() * (max - min) + min;

const makeCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  return canvas;
};

// ---------------------------------------------------------------------------
// Static sprites
// ---------------------------------------------------------------------------

function buildAtmosphereSprite(dpr) {
  const half = SPHERE_RADIUS * 4;
  const canvas = makeCanvas(half * 2 * dpr, half * 2 * dpr);
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, half * dpr, half * dpr);

  const gradient = g.createRadialGradient(
    0,
    0,
    SPHERE_RADIUS * 0.8,
    0,
    0,
    SPHERE_RADIUS * 3.8,
  );
  gradient.addColorStop(0, "rgba(0, 55, 150, 0.18)");
  gradient.addColorStop(0.35, "rgba(0, 30, 100, 0.08)");
  gradient.addColorStop(0.7, "rgba(0, 10, 40, 0.025)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  g.fillStyle = gradient;
  g.beginPath();
  g.arc(0, 0, half, 0, TAU);
  g.fill();

  return { canvas, half };
}

function buildHaloSprite(dpr) {
  const half = SPHERE_RADIUS * 1.65;
  const canvas = makeCanvas(half * 2 * dpr, half * 2 * dpr);
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, half * dpr, half * dpr);

  const gradient = g.createRadialGradient(
    0,
    0,
    SPHERE_RADIUS * 0.9,
    0,
    0,
    half,
  );
  gradient.addColorStop(0, "rgba(0, 120, 255, 0.55)");
  gradient.addColorStop(0.35, "rgba(0, 110, 255, 0.28)");
  gradient.addColorStop(0.7, "rgba(0, 80, 220, 0.10)");
  gradient.addColorStop(1, "rgba(0, 40, 150, 0)");

  g.fillStyle = gradient;
  g.beginPath();
  g.arc(0, 0, half, 0, TAU);
  g.fill();

  return { canvas, half };
}

function buildSphereSprite(dpr) {
  const half = SPHERE_RADIUS + 1;
  const canvas = makeCanvas(half * 2 * dpr, half * 2 * dpr);
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, half * dpr, half * dpr);

  const gradient = g.createRadialGradient(-10, -12, 2, 0, 0, SPHERE_RADIUS);
  gradient.addColorStop(0, "#000000");
  gradient.addColorStop(0.72, "#000000");
  gradient.addColorStop(0.9, "#00101f");
  gradient.addColorStop(0.97, "#003c72");
  gradient.addColorStop(1, "#008cff");

  g.fillStyle = gradient;
  g.beginPath();
  g.arc(0, 0, SPHERE_RADIUS, 0, TAU);
  g.fill();

  return { canvas, half };
}

function buildRimSprite(dpr) {
  const blur = 16;
  const half = SPHERE_RADIUS + blur * 1.5 + 2;
  const canvas = makeCanvas(half * 2 * dpr, half * 2 * dpr);
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, half * dpr, half * dpr);

  // shadowBlur ignores the transform, so scale it by hand.
  g.shadowColor = "#008cff";
  g.shadowBlur = blur * dpr;
  g.strokeStyle = "#008cff";
  g.lineWidth = 1.8;
  g.beginPath();
  g.arc(0, 0, SPHERE_RADIUS - 0.5, 0, TAU);
  g.stroke();

  return { canvas, half };
}

function buildBlobSprite(blob, dpr) {
  // Bounds of all particles at pulse = 1 (pulse is applied as a uniform scale).
  const halfW = blob.width * 0.9 + 2;
  const halfH = blob.height * 0.8 + blob.width * 0.58 + 2;
  const canvas = makeCanvas(halfW * 2 * dpr, halfH * 2 * dpr);
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, halfW * dpr, halfH * dpr);
  g.globalCompositeOperation = "screen";

  for (const particle of blob.particles) {
    const px = particle.x * blob.width;
    const py = particle.y * blob.height;
    const size = blob.width * particle.size;

    const gradient = g.createRadialGradient(px, py, 0, px, py, size);
    gradient.addColorStop(0, `rgba(0, 150, 255, ${blob.opacity * 0.8})`);
    gradient.addColorStop(0.35, `rgba(0, 100, 240, ${blob.opacity * 0.45})`);
    gradient.addColorStop(0.7, `rgba(0, 55, 180, ${blob.opacity * 0.15})`);
    gradient.addColorStop(1, "rgba(0, 20, 80, 0)");

    g.fillStyle = gradient;
    g.beginPath();
    g.arc(px, py, size, 0, TAU);
    g.fill();
  }

  return { canvas, halfW, halfH };
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export function createCosmicScene(canvas, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext("2d", { alpha: false });

  let W = 0;
  let H = 0;
  let cx = 0;
  let cy = 0;
  let dpr = 1;
  let maxDistance = 0;

  let sprites = null;
  let rafId = 0;
  let running = false;
  let lastTime = 0;
  let lastDrawTime = 0;
  let destroyed = false;

  const minFrameMs = opts.maxFps ? 1000 / opts.maxFps : 0;

  const reducedMotionQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  const prefersReducedMotion = () => Boolean(reducedMotionQuery?.matches);

  // --- stars ---------------------------------------------------------------

  const fadeStart = SPHERE_RADIUS * 1.8;
  const fadeEnd = SPHERE_RADIUS * 1.35;

  const stars = [];
  const starCount = opts.starCount;

  // Per-frame scratch buffers, allocated once.
  const sx = new Float32Array(starCount);
  const sy = new Float32Array(starCount);
  const stx = new Float32Array(starCount);
  const sty = new Float32Array(starCount);
  const alphaIdx = new Uint8Array(starCount);
  const widthIdx = new Uint8Array(starCount);

  function resetStar(star, initial) {
    star.angle = random(0, TAU);
    star.cos = Math.cos(star.angle);
    star.sin = Math.sin(star.angle);
    star.distance = initial
      ? random(SPHERE_RADIUS + 100, Math.max(SPHERE_RADIUS + 101, maxDistance))
      : maxDistance + random(20, 180);
    star.size = random(0.45, 1.65);
    star.brightness = random(0.55, 1);
    star.twinkle = random(0, TAU);
    star.elongation = random(2, 7);

    const lineWidth = Math.max(MIN_LINE_WIDTH, star.size * 0.65);
    star.widthIdx = Math.min(
      WIDTH_LEVELS - 1,
      Math.floor((lineWidth - MIN_LINE_WIDTH) / WIDTH_STEP),
    );
    return star;
  }

  // --- gas clouds ------------------------------------------------------------

  const gasBlobs = Array.from({ length: opts.gasCount }, () => ({
    angle: random(0, TAU),
    distance: random(85, 150),
    width: random(35, 75),
    height: random(10, 24),
    opacity: random(0.025, 0.07),
    speed: random(0.004, 0.012),
    phase: random(0, TAU),
    particles: Array.from({ length: 6 }, (_, i) => ({
      x: Math.sin(i * 2.4 + Math.random() * 2) * 0.32,
      y: Math.cos(i * 1.7 + Math.random() * 2) * 0.8,
      size: random(0.35, 0.58),
    })),
  }));

  // --- sizing ----------------------------------------------------------------

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const nextW = Math.max(1, Math.round(rect.width));
    const nextH = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);

    const sizeChanged = nextW !== W || nextH !== H;
    const dprChanged = nextDpr !== dpr || !sprites;
    if (!sizeChanged && !dprChanged) return;

    W = nextW;
    H = nextH;
    dpr = nextDpr;
    cx = W / 2;
    cy = H / 2;
    maxDistance = Math.hypot(W / 2, H / 2) + 100;

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    if (dprChanged) {
      sprites = {
        atmosphere: buildAtmosphereSprite(dpr),
        halo: buildHaloSprite(dpr),
        sphere: buildSphereSprite(dpr),
        rim: buildRimSprite(dpr),
        blobs: gasBlobs.map((blob) => buildBlobSprite(blob, dpr)),
      };
    }

    if (stars.length === 0) {
      for (let i = 0; i < starCount; i++) stars.push(resetStar({}, true));
    }

    // Resizing the canvas clears it: repaint immediately so there is no flash.
    draw(lastTime || performance.now());
  }

  // --- simulation ------------------------------------------------------------

  function step(k) {
    for (const blob of gasBlobs) blob.angle += blob.speed * k;

    for (const star of stars) {
      const progress = 1 - star.distance / maxDistance;
      const speed = 0.035 + progress * progress * progress * 0.22;
      star.distance -= speed * k;
      if (star.distance < fadeEnd) resetStar(star, false);
    }
  }

  // --- drawing ---------------------------------------------------------------

  function drawSprite(sprite, x, y) {
    ctx.drawImage(
      sprite.canvas,
      x - sprite.half,
      y - sprite.half,
      sprite.half * 2,
      sprite.half * 2,
    );
  }

  function drawGas(time) {
    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < gasBlobs.length; i++) {
      const blob = gasBlobs[i];
      const sprite = sprites.blobs[i];

      const x = cx + Math.cos(blob.angle) * blob.distance;
      const y = cy + Math.sin(blob.angle) * blob.distance * 0.72;
      const pulse = 1 + Math.sin(time * 0.0015 + blob.phase) * 0.08;

      const rotation = blob.angle + Math.PI / 2;
      const a = Math.cos(rotation) * pulse * dpr;
      const b = Math.sin(rotation) * pulse * dpr;
      ctx.setTransform(a, b, -b, a, x * dpr, y * dpr);
      ctx.drawImage(
        sprite.canvas,
        -sprite.halfW,
        -sprite.halfH,
        sprite.halfW * 2,
        sprite.halfH * 2,
      );
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawStars(time) {
    // 1) compute positions and buckets
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const d = star.distance;

      const pulse = 0.75 + Math.sin(time * 0.003 + star.twinkle) * 0.25;
      const fade =
        d < fadeStart ? (d - fadeEnd) / (fadeStart - fadeEnd) : 1;
      const alpha = star.brightness * pulse * Math.max(0, Math.min(1, fade));

      alphaIdx[i] = Math.round(alpha * ALPHA_LEVELS);
      widthIdx[i] = star.widthIdx;

      const trail = star.elongation * (1 + (1 - d / maxDistance) * 4);
      sx[i] = cx + star.cos * d;
      sy[i] = cy + star.sin * d;
      stx[i] = cx + star.cos * (d + trail);
      sty[i] = cy + star.sin * (d + trail);
    }

    ctx.globalCompositeOperation = "screen";

    // 2) one path per (alpha, width) bucket
    for (let level = 1; level <= ALPHA_LEVELS; level++) {
      const alpha = level / ALPHA_LEVELS;

      // trails
      ctx.strokeStyle = "rgb(150, 210, 255)";
      ctx.globalAlpha = alpha * 0.5;
      for (let w = 0; w < WIDTH_LEVELS; w++) {
        let any = false;
        ctx.beginPath();
        for (let i = 0; i < stars.length; i++) {
          if (alphaIdx[i] !== level || widthIdx[i] !== w) continue;
          ctx.moveTo(stx[i], sty[i]);
          ctx.lineTo(sx[i], sy[i]);
          any = true;
        }
        if (any) {
          ctx.lineWidth = MIN_LINE_WIDTH + WIDTH_STEP * (w + 0.5);
          ctx.stroke();
        }
      }

      // soft glow
      ctx.fillStyle = "rgb(150, 210, 255)";
      ctx.globalAlpha = alpha * 0.18;
      let anyGlow = false;
      ctx.beginPath();
      for (let i = 0; i < stars.length; i++) {
        if (alphaIdx[i] !== level) continue;
        const r = stars[i].size * 2.5;
        ctx.moveTo(sx[i] + r, sy[i]);
        ctx.arc(sx[i], sy[i], r, 0, TAU);
        anyGlow = true;
      }
      if (!anyGlow) continue;
      ctx.fill();

      // bright core
      ctx.fillStyle = "rgb(235, 248, 255)";
      ctx.globalAlpha = Math.min(1, alpha + 0.15);
      ctx.beginPath();
      for (let i = 0; i < stars.length; i++) {
        if (alphaIdx[i] !== level) continue;
        const r = stars[i].size;
        ctx.moveTo(sx[i] + r, sy[i]);
        ctx.arc(sx[i], sy[i], r, 0, TAU);
      }
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function draw(time) {
    if (!sprites) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    drawSprite(sprites.atmosphere, cx, cy);
    drawGas(time);
    drawStars(time);

    ctx.globalCompositeOperation = "screen";
    drawSprite(sprites.halo, cx, cy);
    ctx.globalCompositeOperation = "source-over";
    drawSprite(sprites.sphere, cx, cy);
    ctx.globalCompositeOperation = "screen";
    drawSprite(sprites.rim, cx, cy);
    ctx.globalCompositeOperation = "source-over";
  }

  // --- loop ------------------------------------------------------------------

  function frame(time) {
    rafId = requestAnimationFrame(frame);

    // Allow ~2 ms of jitter so a 60 Hz display never drops to 30 fps.
    if (minFrameMs && time - lastDrawTime < minFrameMs - 2) return;

    // Clamp so returning from a background tab does not teleport everything.
    const dt = lastTime ? Math.min(time - lastTime, 50) : FRAME_MS;
    lastTime = time;
    lastDrawTime = time;

    step(dt / FRAME_MS);
    draw(time);
  }

  function run() {
    if (destroyed || running) return;
    if (prefersReducedMotion()) {
      draw(performance.now());
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

  // `wanted` is what the owner asked for; reduced motion can still veto it.
  let wanted = false;

  function start() {
    wanted = true;
    run();
  }

  function stop() {
    wanted = false;
    halt();
  }

  const handleMotionPreference = () => {
    halt();
    if (wanted) run();
    else draw(performance.now());
  };

  const resizeObserver =
    typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;

  resizeObserver?.observe(canvas);
  window.addEventListener("resize", resize);
  reducedMotionQuery?.addEventListener?.("change", handleMotionPreference);

  resize();

  return {
    start,
    stop,
    resize,
    destroy() {
      destroyed = true;
      stop();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      reducedMotionQuery?.removeEventListener?.(
        "change",
        handleMotionPreference,
      );
    },
  };
}
