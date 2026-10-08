import { cwDelta, getButtonConfig, getRandomNumber } from "./utils.js";

describe("getRandomNumber", () => {
  test("never returns an already used number", () => {
    const used = [0, 1, 2, 3];
    for (let i = 0; i < 100; i++) {
      const n = getRandomNumber(used, 5);
      expect(n).toBe(4);
    }
  });

  test("stays within the deck size", () => {
    for (let i = 0; i < 200; i++) {
      const n = getRandomNumber([], 22);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(22);
    }
  });
});

describe("cwDelta", () => {
  test("returns the clockwise distance between angles", () => {
    expect(cwDelta(0, 90)).toBe(90);
    expect(cwDelta(270, 90)).toBe(180);
    expect(cwDelta(-90, 0)).toBe(90);
  });

  test("treats equal angles as a full turn", () => {
    expect(cwDelta(45, 45)).toBe(360);
  });
});

describe("getButtonConfig", () => {
  const noop = () => {};

  test("offers to draw cards when none are drawn yet", () => {
    expect(getButtonConfig(undefined, false, 1, undefined, noop, noop).text).toBe(
      "See Your Fortune",
    );
  });

  test("is disabled until the third card of a spread arrives", () => {
    const config = getButtonConfig({ name: "The Fool" }, false, 3, undefined, noop, noop);
    expect(config.text).toBe("Show Meaning");
    expect(config.disabled).toBe(true);
  });
});
