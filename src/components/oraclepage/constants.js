export const closeButtonStyles = {
  background: "#000",
  color: "#4fc3f7",
  border: "1px solid #1565c0",
  borderRadius: "full",
  fontSize: "lg",
  fontWeight: "bold",
  width: "90px",
  height: "90px",
  minW: "48px",
  padding: 0,
  boxShadow:
    "0 0 8px 2px #1a237e, 0 0 18px 4px #0d47a1, inset 0 0 8px 2px #1a237e, inset 0 0 18px 4px #0d47a1",
  _hover: {
    background: "#0a0a1a",
    boxShadow:
      "0 0 14px 4px #283593, 0 0 30px 8px #1565c0, inset 0 0 14px 4px #283593, inset 0 0 30px 8px #1565c0",
  },
  transition: "box-shadow 0.3s ease, background 0.3s ease",
};

export const rotationTransition = {
  duration: 15,
  repeat: Infinity,
  ease: "linear",
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

export const ORBIT_R = 110;
export const AI_BTN_HALF = 45;

export const START_DEG = -20;
export const END_DEG = 190;

export const ORBIT_DURATION = 3;
