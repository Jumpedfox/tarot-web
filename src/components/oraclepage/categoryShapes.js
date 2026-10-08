// Shapes of the category buttons.
//
// Points are in "button units": 1 unit = the button's radius, origin at the
// button's centre, y pointing down. Every shape is a polygon (the circle and
// the heart are finely sampled), so one code path draws all of them.

const regularPolygon = (sides, radius, startDeg = -90) =>
  Array.from({ length: sides }, (_, i) => {
    const angle = ((startDeg + (360 / sides) * i) * Math.PI) / 180;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });

function heart() {
  // Classic heart curve, centred on its bounding box and scaled to ~2.3 units wide.
  const raw = Array.from({ length: 96 }, (_, i) => {
    const t = (i / 96) * Math.PI * 2;
    return [
      16 * Math.sin(t) ** 3,
      -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    ];
  });
  const ys = raw.map(([, y]) => y);
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const scale = 2.3 / 32;
  return raw.map(([x, y]) => [x * scale, (y - cy) * scale]);
}

export const SHAPES = {
  circle: regularPolygon(96, 1),
  square: [
    [-0.85, -0.85],
    [0.85, -0.85],
    [0.85, 0.85],
    [-0.85, 0.85],
  ],
  // Equilateral, pointing down.
  triangleDown: regularPolygon(3, 1.3, 90),
  rhombus: [
    [0, -1.25],
    [1.1, 0],
    [0, 1.25],
    [-1.1, 0],
  ],
  heptagon: regularPolygon(7, 1.08),
  heart: heart(),
};

export const CATEGORY_SHAPES = {
  Love: "heart",
  Health: "square",
  Work: "triangleDown",
  Finance: "circle",
  Personal: "rhombus",
  General: "heptagon",
};

// Moves the label towards the widest part of the shape (units, + = down).
export const LABEL_OFFSET = {
  triangleDown: -0.3,
  heart: -0.1,
};

// Every shape fits in a square of +-SHAPE_EXTENT units.
export const SHAPE_EXTENT = 1.4;
