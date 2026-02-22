import { ORBIT_R, AI_BTN_HALF } from "./constants";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRandomNumber = (usedNumbers, maxCards) => {
  let num;
  do {
    num = Math.floor(Math.random() * maxCards);
  } while (usedNumbers.includes(num));
  return num;
};

export const getRandomTwist = () =>
  (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 5 + 2);

export const getRandomRotation = () => (Math.random() < 0.5 ? 180 : 0);

export const getButtonConfig = (
  card1,
  meaningIsVisible,
  numberOfCards,
  card3,
  handleSeeFortuneClick,
  handleToggleMeaning,
) => {
  if (!card1) {
    return {
      text: "See Your Fortune",
      onClick: handleSeeFortuneClick,
      disabled: false,
    };
  }

  return {
    text: meaningIsVisible ? "Hide Meaning" : "Show Meaning",
    onClick: handleToggleMeaning,
    disabled: numberOfCards === 3 && !card3,
  };
};

export const ARC_CONFIG = {
  radius: 170,
  radiusMobile: 130,
  arcDegrees: 300,
  startAngleDegrees: 90,
};

export const CIRCLE_CONFIG = {
  radius: 170,
  radiusMobile: 130,
  arcDegrees: 360,
  startAngleDegrees: -90,
};

export const getCategoryPosition = (index, total, isSelected, isMobile) => {
  const config = isSelected ? CIRCLE_CONFIG : ARC_CONFIG;
  const { radius, radiusMobile, arcDegrees, startAngleDegrees } = config;

  const r = isMobile ? radiusMobile : radius;
  const arcSpan = (arcDegrees * Math.PI) / 180;
  const startAngle = (startAngleDegrees * Math.PI) / 180;
  const denominator = isSelected ? total : Math.max(1, total - 1);
  const angleStep = arcSpan / denominator;
  const angle = startAngle + index * angleStep;

  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  };
};

export const posFromAngle = (deg, btnSize) => ({
  left: btnSize / 2 + ORBIT_R * Math.cos((deg * Math.PI) / 180) - AI_BTN_HALF,
  top: btnSize / 2 + ORBIT_R * Math.sin((deg * Math.PI) / 180) - AI_BTN_HALF,
});

export const cwDelta = (from, to) => {
  const f = ((from % 360) + 360) % 360;
  const t = ((to % 360) + 360) % 360;

  let delta = t - f;
  if (delta <= 0) delta += 360;

  return delta;
};
