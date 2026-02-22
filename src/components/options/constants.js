export const ICONS = [
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconhandball.png",
    top: "5%",
    left: "50%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconhandmoon.png",
    top: "11.5%",
    left: "71.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconmoonhand.png",
    top: "28.5%",
    left: "88.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconstones.png",
    top: "50%",
    left: "95%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconplanets.png",
    top: "71.5%",
    left: "88.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconstarshand.png",
    top: "88.5%",
    left: "71.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/icontree.png",
    top: "95%",
    left: "50%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconpot.png",
    top: "88.5%",
    left: "28.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconpalmistry.png",
    top: "71.5%",
    left: "11.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconhandstars.png",
    top: "50%",
    left: "5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconstone.png",
    top: "30%",
    left: "12.5%",
  },
  {
    url: "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconmoonandstars.png",
    top: "12.5%",
    left: "30%",
  },
];

const mix = (a, b, t) => a + (b - a) * t;

const mixColor = (c1, c2, t) => ({
  r: Math.round(mix(c1.r, c2.r, t)),
  g: Math.round(mix(c1.g, c2.g, t)),
  b: Math.round(mix(c1.b, c2.b, t)),
  a: mix(c1.a, c2.a, t),
});

const rgba = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`;

export const mixShadow = (shadowA, shadowB, t) => {
  return shadowA
    .map((sa, i) => {
      const sb = shadowB[i];

      return `${sa.inset ? "inset " : ""}
        ${mix(sa.x, sb.x, t)}px
        ${mix(sa.y, sb.y, t)}px
        ${mix(sa.blur, sb.blur, t)}px
        ${mix(sa.spread, sb.spread, t)}px
        ${rgba(mixColor(sa.color, sb.color, t))}
      `;
    })
    .join(",");
};

export const normalizeShadowProgress = (value) => {
  const tRaw = Math.round(value * 20) / 100;
  return Math.min(tRaw / 0.2, 1);
};

export const shadowA = [
  {
    x: 0,
    y: 5,
    blur: 5,
    spread: 0,
    color: { r: 7, g: 14, b: 114, a: 0.5 },
    inset: true,
  },
  {
    x: 0,
    y: 5,
    blur: 5,
    spread: 0,
    color: { r: 7, g: 14, b: 114, a: 0.5 },
    inset: true,
  },
  {
    x: 0,
    y: -4,
    blur: 10,
    spread: 0,
    color: { r: 7, g: 14, b: 114, a: 0.5 },
    inset: false,
  },
];

export const shadowB = [
  {
    x: 0,
    y: 10,
    blur: 5,
    spread: 0,
    color: { r: 0, g: 17, b: 255, a: 0.5 },
    inset: true,
  },
  {
    x: 0,
    y: 12,
    blur: 10,
    spread: 10,
    color: { r: 4, g: 0, b: 255, a: 0.5 },
    inset: true,
  },
  {
    x: 0,
    y: -8,
    blur: 10,
    spread: 0,
    color: { r: 47, g: 0, b: 255, a: 0.5 },
    inset: false,
  },
];
