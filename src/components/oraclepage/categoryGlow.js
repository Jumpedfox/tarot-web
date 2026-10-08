// Pre-rendered images for the shaped category buttons.
//
// The original round buttons were a white box-shadow (outer glow + inner
// fog) with a rotating conic-gradient disc under CSS blur(20px) on top. A
// live blur on six moving buttons stalls the first frames, and box-shadow
// can only follow rounded rectangles, so the same look is rendered once per
// shape / gradient into images:
//
//   base   - the white glow and inner fog, following the shape (static)
//   mask   - the blurred silhouette that gives the colour glow its shape
//   colour - the blurred gradient; the GPU only rotates it under the mask
//
// Images are drawn for a 120px button and scaled for other sizes.

import { SHAPES, SHAPE_EXTENT, CATEGORY_SHAPES } from "./categoryShapes.js";
import { CATEGORY_GRADIENTS } from "../../shared/constants/categories.ts";

export const REFERENCE_BUTTON_SIZE = 120;
const R = REFERENCE_BUTTON_SIZE / 2; // px per shape unit

// Values from the original styles (box-shadow blur = 2 * sigma).
const COLOUR_BLUR = 20; // filter: blur(20px), disc 10px larger than the button
const COLOUR_GROW = 10;
const OUTER_GLOW_BLUR = 7.5; // 0 0 15px 1px white
const OUTER_GLOW_GROW = 1;
const FOG_BLUR = 50; // inset 0 0 100px 30px white
const FOG_SHRINK = 30;

const MASK_HALF = Math.ceil(SHAPE_EXTENT * (R + COLOUR_GROW) + COLOUR_BLUR * 3);
const BASE_HALF = Math.ceil(
  SHAPE_EXTENT * (R + OUTER_GLOW_GROW) + OUTER_GLOW_BLUR * 3 + 2,
);
// The colour field rotates under the mask, so it must cover the mask's corners.
const COLOUR_HALF = Math.ceil(MASK_HALF * Math.SQRT2) + COLOUR_BLUR * 3;

export const IMAGE_HALF = { mask: MASK_HALF, base: BASE_HALF, colour: COLOUR_HALF };

// --- canvas helpers ---------------------------------------------------------

const makeCanvas = (half) => {
  const canvas = document.createElement("canvas");
  canvas.width = half * 2;
  canvas.height = half * 2;
  return canvas;
};

let nativeBlur = null;
function supportsCanvasFilter() {
  if (nativeBlur !== null) return nativeBlur;
  const canvas = document.createElement("canvas");
  canvas.width = 5;
  canvas.height = 5;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!("filter" in ctx)) return (nativeBlur = false);
  ctx.filter = "blur(1px)";
  ctx.fillRect(2, 2, 1, 1);
  nativeBlur = ctx.getImageData(0, 2, 1, 1).data[3] > 0;
  return nativeBlur;
}

// Gaussian blur fallback for browsers without ctx.filter: three box blur
// passes over premultiplied RGBA.
function boxBlurPass(src, dst, width, height, radius, horizontal) {
  const span = radius * 2 + 1;
  const lines = horizontal ? height : width;
  const length = horizontal ? width : height;
  for (let line = 0; line < lines; line++) {
    for (let channel = 0; channel < 4; channel++) {
      const at = (i) =>
        horizontal
          ? (line * width + i) * 4 + channel
          : (i * width + line) * 4 + channel;
      let sum = 0;
      for (let i = -radius; i <= radius; i++) {
        sum += i >= 0 && i < length ? src[at(i)] : 0;
      }
      for (let i = 0; i < length; i++) {
        dst[at(i)] = sum / span;
        const incoming = i + radius + 1;
        const outgoing = i - radius;
        if (incoming < length) sum += src[at(incoming)];
        if (outgoing >= 0) sum -= src[at(outgoing)];
      }
    }
  }
}

function blurInJs(canvas, sigma) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const { width, height } = canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  let a = new Float32Array(data.length);
  let b = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    a[i] = data[i] * alpha;
    a[i + 1] = data[i + 1] * alpha;
    a[i + 2] = data[i + 2] * alpha;
    a[i + 3] = data[i + 3];
  }

  const radius = Math.max(1, Math.round((Math.sqrt(4 * sigma * sigma + 1) - 1) / 2));
  for (let pass = 0; pass < 3; pass++) {
    boxBlurPass(a, b, width, height, radius, true);
    boxBlurPass(b, a, width, height, radius, false);
  }

  for (let i = 0; i < data.length; i += 4) {
    const alpha = a[i + 3];
    const k = alpha > 0 ? 255 / alpha : 0;
    data[i] = a[i] * k;
    data[i + 1] = a[i + 1] * k;
    data[i + 2] = a[i + 2] * k;
    data[i + 3] = alpha;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

// Returns a new canvas with `paint` drawn and blurred by `sigma`.
function blurred(half, sigma, paint) {
  const source = makeCanvas(half);
  paint(source.getContext("2d"));
  if (!supportsCanvasFilter()) return blurInJs(source, sigma);

  const target = makeCanvas(half);
  const ctx = target.getContext("2d");
  ctx.filter = `blur(${sigma}px)`;
  ctx.drawImage(source, 0, 0);
  return target;
}

// Path of `shape`, `px` pixels per unit, centred at (c, c).
function shapePath(ctx, shape, px, c) {
  const points = SHAPES[shape];
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(c + x * px, c + y * px);
    else ctx.lineTo(c + x * px, c + y * px);
  });
  ctx.closePath();
}

// --- images -----------------------------------------------------------------

function renderMask(shape) {
  return blurred(MASK_HALF, COLOUR_BLUR, (ctx) => {
    ctx.fillStyle = "#fff";
    shapePath(ctx, shape, R + COLOUR_GROW, MASK_HALF);
    ctx.fill();
  }).toDataURL("image/png");
}

function renderBase(shape) {
  const outer = blurred(BASE_HALF, OUTER_GLOW_BLUR, (ctx) => {
    ctx.fillStyle = "#fff";
    shapePath(ctx, shape, R + OUTER_GLOW_GROW, BASE_HALF);
    ctx.fill();
  });

  // Inner fog: white everywhere except a shrunken shape, blurred, then kept
  // only inside the shape. Drawn with extra room so the canvas edge doesn't
  // thin it out.
  const fogHalf = BASE_HALF + FOG_BLUR * 3;
  const fog = blurred(fogHalf, FOG_BLUR, (ctx) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, fogHalf * 2, fogHalf * 2);
    ctx.globalCompositeOperation = "destination-out";
    shapePath(ctx, shape, Math.max(1, R - FOG_SHRINK), fogHalf);
    ctx.fill();
  });

  const result = makeCanvas(BASE_HALF);
  const ctx = result.getContext("2d");
  ctx.drawImage(outer, 0, 0);
  ctx.save();
  shapePath(ctx, shape, R, BASE_HALF);
  ctx.clip();
  ctx.drawImage(fog, BASE_HALF - fogHalf, BASE_HALF - fogHalf);
  ctx.restore();
  return result.toDataURL("image/png");
}

// "conic-gradient(from 0deg, #ff0000 0%, ...)" -> [{ color, offset }]
function parseConicGradient(css) {
  const stops = [];
  const pattern = /(#[0-9a-fA-F]{3,8})\s+([\d.]+)%/g;
  let match;
  while ((match = pattern.exec(css))) {
    stops.push({ color: match[1], offset: Math.min(1, parseFloat(match[2]) / 100) });
  }
  return stops;
}

function renderColour(gradientCss) {
  const stops = parseConicGradient(gradientCss);
  const probe = document.createElement("canvas").getContext("2d");
  if (stops.length < 2 || !probe.createConicGradient) return null;

  // Drawn bigger than needed and cropped, so the blur has no faded edge.
  const drawHalf = COLOUR_HALF + COLOUR_BLUR * 3;
  const field = blurred(drawHalf, COLOUR_BLUR, (ctx) => {
    // CSS conic gradients start at 12 o'clock, canvas ones at 3 o'clock.
    const gradient = ctx.createConicGradient(-Math.PI / 2, drawHalf, drawHalf);
    stops.forEach(({ color, offset }) => gradient.addColorStop(offset, color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, drawHalf * 2, drawHalf * 2);
  });

  const result = makeCanvas(COLOUR_HALF);
  result
    .getContext("2d")
    .drawImage(field, COLOUR_HALF - drawHalf, COLOUR_HALF - drawHalf);
  return result.toDataURL("image/png");
}

// --- cache --------------------------------------------------------------------

const cache = new Map();
// Keeps a decoded copy of every image, so showing it later costs no decode.
const decoded = [];

const cached = (key, render) => {
  if (!cache.has(key)) {
    let value = null;
    try {
      value = typeof document === "undefined" ? null : render();
    } catch (error) {
      console.error("Category glow render failed:", error);
    }
    if (value) {
      const img = new Image();
      img.src = value;
      img.decode?.().catch(() => {});
      decoded.push(img);
    }
    cache.set(key, value);
  }
  return cache.get(key);
};

export const shapeMask = (shape) => cached(`mask:${shape}`, () => renderMask(shape));
export const shapeBase = (shape) => cached(`base:${shape}`, () => renderBase(shape));
// Data URL, or null when the browser can't draw conic gradients on canvas.
export const colourField = (gradient) =>
  cached(`colour:${gradient}`, () => renderColour(gradient));

// Render everything ahead of time, one image per idle period, so the first
// appearance of the category circle doesn't stall.
export function prerenderCategoryGlows() {
  const tasks = [
    ...Object.values(CATEGORY_SHAPES).flatMap((shape) => [
      () => shapeBase(shape),
      () => shapeMask(shape),
    ]),
    ...Object.values(CATEGORY_GRADIENTS).map((gradient) => () => colourField(gradient)),
  ];

  const idle =
    typeof window.requestIdleCallback === "function"
      ? (fn) => window.requestIdleCallback(fn, { timeout: 3000 })
      : (fn) => window.setTimeout(fn, 50);

  const runNext = () => {
    const task = tasks.shift();
    if (!task) return;
    task();
    idle(runNext);
  };
  idle(runNext);
}
