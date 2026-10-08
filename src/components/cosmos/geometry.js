// Shared geometry of the black hole and the menu button it lives in.
// The star field uses it to aim the star stream at the button.

// Scene units (1 unit = 1 CSS px at scale 1).
export const SPHERE_RADIUS = 62;
// Half extent of the black hole scene: atmosphere and orbiting gas fit inside.
export const SCENE_HALF = 250;

// Chakra's `md` breakpoint (48em).
export const MOBILE_MAX_WIDTH = 768;

// The menu button: its size and how far it hangs below the bottom edge.
export const MENU_BUTTON = {
  desktop: { size: 250, bottom: -100 },
  mobile: { size: 120, bottom: -40 },
  // framer-motion `y` of the button at rest.
  restY: 20,
};

// A button of `size` px shows the scene at this scale: the halo
// (1.65 sphere radii) reaches the edge of the button.
export const holeScale = (size) => size / 2 / (SPHERE_RADIUS * 1.65);

// CSS size of the square canvas that fits the whole scene for a button.
export const holeCanvasSize = (size) => Math.ceil(SCENE_HALF * 2 * holeScale(size));

// Where the centre of the black hole sits for a viewport of width x height.
export function menuHoleCenter(width, height) {
  const geometry =
    width < MOBILE_MAX_WIDTH ? MENU_BUTTON.mobile : MENU_BUTTON.desktop;

  return {
    x: width / 2,
    y: height - geometry.bottom - geometry.size / 2 + MENU_BUTTON.restY,
    scale: holeScale(geometry.size),
  };
}
