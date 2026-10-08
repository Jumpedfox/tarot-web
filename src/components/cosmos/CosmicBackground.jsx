import { useEffect, useRef } from "react";
import { createStarfield } from "./starfield.js";
import { menuHoleCenter } from "./geometry.js";

/**
 * Full-screen star stream falling into the black hole menu button.
 *
 * Rendered as a fixed canvas behind the app. `paused` stops the animation
 * loop; `filter` is applied with CSS so the theme brightness can transition
 * without re-rendering the scene.
 */
const CosmicBackground = ({ paused = false, filter = "none" }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = createStarfield(canvasRef.current, {
      getTarget: menuHoleCenter,
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (paused) scene.stop();
    else scene.start();
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 0,
        pointerEvents: "none",
        filter,
        transition: "filter 3s",
      }}
    />
  );
};

export default CosmicBackground;
