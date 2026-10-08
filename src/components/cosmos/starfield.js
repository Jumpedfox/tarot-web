// Full-screen star stream falling into a point (the black hole).
//
// Stars are batched by quantized alpha and line width: ~50 draw calls per
// frame instead of one path per star, and no rgba() strings are allocated
// per frame.

import { createRenderLoop, random, TAU } from "./renderLoop.js";
import { SPHERE_RADIUS } from "./geometry.js";

const ALPHA_LEVELS = 12;
const WIDTH_LEVELS = 3;
const MIN_LINE_WIDTH = 0.3;
const WIDTH_STEP = 0.26;

// Stars are spawned on the part of the circle that can reach the screen:
// a little wider than the upper half, since the hole sits at the bottom edge.
const SPAWN_FROM = Math.PI - 0.2;
const SPAWN_TO = TAU + 0.2;

export function createStarfield(canvas, { count = 700, getTarget, ...loopOptions }) {
  const ctx = canvas.getContext("2d", { alpha: false });

  let W = 0;
  let H = 0;
  let dpr = 1;
  let target = { x: 0, y: 0, scale: 1 };
  let maxDistance = 0;
  let fadeStart = 0;
  let fadeEnd = 0;

  // 1 = full stream, 0 = stars hang still. Eased towards flowTarget so the
  // stream slows down and speeds up smoothly (e.g. while the menu is open).
  let flow = 1;
  let flowTarget = 1;

  const stars = [];
  const sx = new Float32Array(count);
  const sy = new Float32Array(count);
  const stx = new Float32Array(count);
  const sty = new Float32Array(count);
  const alphaIdx = new Uint8Array(count);

  function resetStar(star, initial) {
    star.angle = random(SPAWN_FROM, SPAWN_TO);
    star.cos = Math.cos(star.angle);
    star.sin = Math.sin(star.angle);
    star.distance = initial
      ? random(fadeStart + 40, Math.max(fadeStart + 41, maxDistance))
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

  function onResize(size) {
    W = size.width;
    H = size.height;
    dpr = size.dpr;
    target = getTarget(W, H);

    // Farthest visible corner from the hole.
    maxDistance =
      Math.max(
        Math.hypot(target.x, target.y),
        Math.hypot(W - target.x, target.y),
        Math.hypot(target.x, H - target.y),
        Math.hypot(W - target.x, H - target.y),
      ) + 100;

    fadeStart = SPHERE_RADIUS * 1.8 * target.scale;
    fadeEnd = SPHERE_RADIUS * 1.35 * target.scale;

    if (stars.length === 0) {
      for (let i = 0; i < count; i++) stars.push(resetStar({}, true));
    }
  }

  // ~1 s to settle at 60 fps.
  const FLOW_EASING = 0.06;

  function step(k) {
    flow += (flowTarget - flow) * (1 - Math.pow(1 - FLOW_EASING, k));
    if (Math.abs(flowTarget - flow) < 0.005) flow = flowTarget;

    for (const star of stars) {
      const progress = 1 - star.distance / maxDistance;
      const speed = (0.035 + progress * progress * progress * 0.22) * flow;
      star.distance -= speed * k;
      if (star.distance < fadeEnd) resetStar(star, false);
    }
  }

  function draw(time) {
    const cx = target.x;
    const cy = target.y;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const d = star.distance;

      const pulse = 0.75 + Math.sin(time * 0.003 + star.twinkle) * 0.25;
      const fade = d < fadeStart ? (d - fadeEnd) / (fadeStart - fadeEnd) : 1;
      const alpha = star.brightness * pulse * Math.max(0, Math.min(1, fade));
      alphaIdx[i] = Math.round(alpha * ALPHA_LEVELS);

      // Trails shrink to dots as the stream stops.
      const trail =
        star.elongation * (1 + (1 - d / maxDistance) * 4) * (0.25 + 0.75 * flow);
      sx[i] = cx + star.cos * d;
      sy[i] = cy + star.sin * d;
      stx[i] = cx + star.cos * (d + trail);
      sty[i] = cy + star.sin * (d + trail);
    }

    ctx.globalCompositeOperation = "screen";

    for (let level = 1; level <= ALPHA_LEVELS; level++) {
      const alpha = level / ALPHA_LEVELS;

      // trails
      ctx.strokeStyle = "rgb(150, 210, 255)";
      ctx.globalAlpha = alpha * 0.5;
      for (let w = 0; w < WIDTH_LEVELS; w++) {
        let any = false;
        ctx.beginPath();
        for (let i = 0; i < stars.length; i++) {
          if (alphaIdx[i] !== level || stars[i].widthIdx !== w) continue;
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
      let anyStar = false;
      ctx.beginPath();
      for (let i = 0; i < stars.length; i++) {
        if (alphaIdx[i] !== level) continue;
        const r = stars[i].size * 2.5;
        ctx.moveTo(sx[i] + r, sy[i]);
        ctx.arc(sx[i], sy[i], r, 0, TAU);
        anyStar = true;
      }
      if (!anyStar) continue;
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
    ctx.globalCompositeOperation = "source-over";
  }

  const loop = createRenderLoop(canvas, {
    maxDpr: 1,
    ...loopOptions,
    onResize,
    onFrame(k, time) {
      if (k) step(k);
      draw(time);
      // Fully stopped: nothing changes any more, so stop rendering too.
      // This also keeps blurred overlays on top of the canvas cheap.
      if (flowTarget === 0 && flow === 0) loop.stop();
    },
  });

  loop.resize();

  return {
    ...loop,
    // calm = true: slow the stream down to a standstill, then pause.
    setCalm(calm) {
      flowTarget = calm ? 0 : 1;
      loop.start();
    },
  };
}
