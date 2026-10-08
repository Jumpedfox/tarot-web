import { useEffect, useRef } from "react";
import { createBlackHole } from "./blackhole.js";
import { holeCanvasSize } from "./geometry.js";

/**
 * The animated black hole, sized for a box of `size` px.
 *
 * The canvas is larger than the box so the atmosphere and orbiting gas can
 * spill outside it; it ignores pointer events, so only the box is clickable.
 */
const BlackHole = ({ size }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = createBlackHole(canvasRef.current);
    scene.start();
    return () => scene.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: holeCanvasSize(size),
        height: holeCanvasSize(size),
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
};

export default BlackHole;
