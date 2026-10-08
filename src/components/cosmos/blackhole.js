// The black hole: atmosphere, orbiting gas clouds, halo, sphere and glowing
// rim, drawn on a transparent canvas centred on the hole.
//
// Everything static is rendered once into sprites; each gas cloud is a sprite
// too (its shape never changes, only position, rotation and a uniform pulse),
// so a frame is ~16 drawImage calls.

import { createRenderLoop, makeCanvas, random, TAU } from "./renderLoop.js";
import { SCENE_HALF, SPHERE_RADIUS } from "./geometry.js";

function sprite(half, res, paint) {
  const canvas = makeCanvas(half * 2 * res, half * 2 * res);
  const g = canvas.getContext("2d");
  g.setTransform(res, 0, 0, res, half * res, half * res);
  paint(g);
  return { canvas, half };
}

function buildAtmosphere(res) {
  return sprite(SPHERE_RADIUS * 4, res, (g) => {
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
    g.arc(0, 0, SPHERE_RADIUS * 4, 0, TAU);
    g.fill();
  });
}

function buildHalo(res) {
  const half = SPHERE_RADIUS * 1.65;
  return sprite(half, res, (g) => {
    const gradient = g.createRadialGradient(0, 0, SPHERE_RADIUS * 0.9, 0, 0, half);
    gradient.addColorStop(0, "rgba(0, 120, 255, 0.55)");
    gradient.addColorStop(0.35, "rgba(0, 110, 255, 0.28)");
    gradient.addColorStop(0.7, "rgba(0, 80, 220, 0.10)");
    gradient.addColorStop(1, "rgba(0, 40, 150, 0)");
    g.fillStyle = gradient;
    g.beginPath();
    g.arc(0, 0, half, 0, TAU);
    g.fill();
  });
}

function buildSphere(res) {
  return sprite(SPHERE_RADIUS + 1, res, (g) => {
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
  });
}

function buildRim(res) {
  const blur = 16;
  return sprite(SPHERE_RADIUS + blur * 1.5 + 2, res, (g) => {
    // shadowBlur ignores the transform, so scale it by hand.
    g.shadowColor = "#008cff";
    g.shadowBlur = blur * res;
    g.strokeStyle = "#008cff";
    g.lineWidth = 1.8;
    g.beginPath();
    g.arc(0, 0, SPHERE_RADIUS - 0.5, 0, TAU);
    g.stroke();
  });
}

function buildBlob(blob, res) {
  // Bounds of all particles at pulse = 1 (the pulse is a uniform scale).
  const halfW = blob.width * 0.9 + 2;
  const halfH = blob.height * 0.8 + blob.width * 0.58 + 2;
  const canvas = makeCanvas(halfW * 2 * res, halfH * 2 * res);
  const g = canvas.getContext("2d");
  g.setTransform(res, 0, 0, res, halfW * res, halfH * res);
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

export function createBlackHole(canvas, { gasCount = 12, ...loopOptions } = {}) {
  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = 1;
  let scale = 1;
  let sprites = null;

  const gasBlobs = Array.from({ length: gasCount }, () => ({
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

  function onResize(size) {
    W = size.width;
    H = size.height;
    dpr = size.dpr;

    // The scene (2 * SCENE_HALF units) is fitted into the canvas.
    const nextScale = Math.min(W, H) / (SCENE_HALF * 2);
    if (sprites && nextScale === scale && !size.dprChanged) return;
    scale = nextScale;

    const res = dpr * scale;
    sprites = {
      atmosphere: buildAtmosphere(res),
      halo: buildHalo(res),
      sphere: buildSphere(res),
      rim: buildRim(res),
      blobs: gasBlobs.map((blob) => buildBlob(blob, res)),
    };
  }

  function drawSprite(s) {
    ctx.drawImage(s.canvas, -s.half, -s.half, s.half * 2, s.half * 2);
  }

  function draw(time) {
    if (!sprites) return;

    const unit = dpr * scale;
    const ox = (W / 2) * dpr;
    const oy = (H / 2) * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";

    // Scene units, origin at the centre of the hole.
    ctx.setTransform(unit, 0, 0, unit, ox, oy);
    drawSprite(sprites.atmosphere);

    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < gasBlobs.length; i++) {
      const blob = gasBlobs[i];
      const s = sprites.blobs[i];

      const x = Math.cos(blob.angle) * blob.distance;
      const y = Math.sin(blob.angle) * blob.distance * 0.72;
      const pulse = 1 + Math.sin(time * 0.0015 + blob.phase) * 0.08;
      const rotation = blob.angle + Math.PI / 2;
      const a = Math.cos(rotation) * pulse * unit;
      const b = Math.sin(rotation) * pulse * unit;

      ctx.setTransform(a, b, -b, a, ox + x * unit, oy + y * unit);
      ctx.drawImage(s.canvas, -s.halfW, -s.halfH, s.halfW * 2, s.halfH * 2);
    }
    ctx.setTransform(unit, 0, 0, unit, ox, oy);

    drawSprite(sprites.halo);
    ctx.globalCompositeOperation = "source-over";
    drawSprite(sprites.sphere);
    ctx.globalCompositeOperation = "screen";
    drawSprite(sprites.rim);
    ctx.globalCompositeOperation = "source-over";
  }

  const loop = createRenderLoop(canvas, {
    maxDpr: 2,
    ...loopOptions,
    onResize,
    onFrame(k, time) {
      if (k) for (const blob of gasBlobs) blob.angle += blob.speed * k;
      draw(time);
    },
  });

  loop.resize();
  return loop;
}
