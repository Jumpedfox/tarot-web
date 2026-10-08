import { ICONS } from "../../components/options/constants.js";
import { prerenderCategoryGlows } from "../../components/oraclepage/categoryGlow.js";

// Images that are not on screen at start but appear with an animation later
// (the options menu icons). Loading and decoding them up front avoids a
// frame drop the first time the menu opens.
const DEFERRED_IMAGES = ICONS.map((icon) => icon.url);

const decodeImage = (url) => {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  // decode() also rasterizes the image, not just downloads it.
  return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
};

const whenIdle = (fn) =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(fn, { timeout: 2000 })
    : window.setTimeout(fn, 300);

let warmedUp = false;

export function warmUpAssets() {
  if (warmedUp) return;
  warmedUp = true;
  whenIdle(() => {
    DEFERRED_IMAGES.forEach(decodeImage);
    prerenderCategoryGlows();
  });
}
