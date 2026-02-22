import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      color: "white",
    },
    "span, p, code": {
      cursor: "default",
    },
    "@keyframes rotate": {
      from: { transform: "translateX(-50%) rotate(0deg)" },
      to: { transform: "translateX(-50%) rotate(360deg)" },
    },
    "@keyframes rotate2": {
      from: { transform: "translate(-50%, -50%) rotate(0deg)" },
      to: { transform: "translate(-50%, -50%) rotate(-360deg)" },
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: "CinzelDecorative, serif" },
        heading: { value: "CinzelDecorative, serif" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
