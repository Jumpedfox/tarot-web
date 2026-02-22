const glow =
  "0px 0px 20px 5px rgb(255,255,255), inset 0px 0px 10px 1px rgb(255,255,255)";
const strongGlow =
  "0px 0px 50px 1px rgb(255,255,255), inset 0px 0px 10px 10px rgb(255,255,255)";
const menuGlow =
  "0px 0px 15px 1px rgb(255,255,255), inset 0px 0px 100px 20px rgb(255,255,255)";
const oracleGlow =
  "0px 0px 15px 1px rgb(255,255,255), inset 0px 0px 100px 30px rgb(255,255,255)";

export const circleButtonBase = {
  border: "none",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  whiteSpace: "normal",
  fontWeight: "black",
};

export const buttonStyles = {
  ...circleButtonBase,
  w: "100px",
  h: "100px",
  bg: "rgba(0,0,0,0.6)",
  color: "white",
  fontSize: "16px",
  transition: "all 1s",
  boxShadow: glow,
  _hover: { boxShadow: strongGlow },
};

export const activeButtonStyles = {
  ...buttonStyles,
  bg: "white",
  color: "black",
  boxShadow:
    "0px 0px 20px 10px rgb(255,255,255), inset 0px 0px 10px 1px rgb(255,255,255)",
};

export const menuButtonStyles = {
  ...circleButtonBase,
  w: "150px",
  h: "150px",
  bg: "transparent",
  fontSize: "18px",
  transition: "0.5s",
  boxShadow: menuGlow,
  color: "black",
  _hover: {
    boxShadow: strongGlow,
    color: "white",
    "& > div": { filter: "invert(75%)" },
  },
};

export const smallButtonStyles = {
  ...menuButtonStyles,
  w: "120px",
  h: "120px",
};

export const oracleButtonStyles = {
  ...circleButtonBase,
  w: "120px",
  h: "120px",
  p: "10px",
  bg: "transparent",
  color: "black",
  fontSize: "16px",
  lineHeight: "1.2",
  transition: "all 0.4s ease-in-out",
  boxShadow: oracleGlow,
  _disabled: {
    opacity: 0.5,
    filter: "grayscale(1)",
    cursor: "not-allowed",
    color: "white",
    boxShadow:
      "0px 0px 20px 2px rgba(255,255,255,0.3), inset 0px 0px 30px 10px rgba(0,0,0,0.8)",
  },
  _hover: {
    color: "white",
    boxShadow:
      "0px 0px 25px 5px rgb(255,255,255), inset 0px 0px 10px 10px rgb(255,255,255)",
  },
};

export const oracleSmallButtonStyles = {
  ...oracleButtonStyles,
  w: "100px",
  h: "100px",
};

export const aiButtonBase = {
  background: "#000",
  color: "#4fc3f7",
  border: "1px solid #1565c0",
  borderRadius: "full",
  fontSize: "sm",
  fontWeight: "bold",
  width: "90px",
  height: "90px",
  minW: "90px",
  padding: 0,
  boxShadow:
    "0 0 8px 2px #1900ff, 0 0 18px 4px #070e72, inset 0 0 8px 2px #1900ff, inset 0 0 14px 4px #070e72",
  _hover: {
    boxShadow:
      "0 0 14px 4px #1900ff, 0 0 30px 8px #070e72, inset 0 0 14px 4px #1900ff, inset 0 0 24px 8px #070e72",
  },
};

export const glowPulse = {
  boxShadow: [
    "0 0 8px 2px #1900ff, 0 0 18px 4px #070e72, inset 0 0 8px 2px #1900ff, inset 0 0 14px 4px #070e72",
    "0 0 24px 8px #1900ff, 0 0 48px 16px #070e72, inset 0 0 24px 8px #1900ff, inset 0 0 36px 12px #070e72",
    "0 0 8px 2px #1900ff, 0 0 18px 4px #070e72, inset 0 0 8px 2px #1900ff, inset 0 0 14px 4px #070e72",
  ],
};
