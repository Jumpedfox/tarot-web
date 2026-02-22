export const MAX_CARDS = 22;
export const spinKeyframes = `
  @keyframes spin-glow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
export const variants = {
  enter: (direction) => {
    if (direction === 0) return { opacity: 0, scale: 0.5, rotateY: 0, x: 0 };
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    };
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    position: "relative",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
  exit: (direction) => {
    return {
      position: "absolute",
      zIndex: 0,
      x: direction === 0 ? 0 : direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 1 },
    };
  },
};

export const SCROLL_MASK_STYLES = {
  "--scroll-shadow-size": "4rem",
  maskImage:
    "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
  "&[data-at-top]": {
    maskImage:
      "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
  },
  "&[data-at-bottom]": {
    maskImage:
      "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
  },
};
