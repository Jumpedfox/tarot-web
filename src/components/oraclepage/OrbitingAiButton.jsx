import {
  motion,
  useMotionValue,
  useTransform,
  animate as animateMotion,
  usePresence,
} from "framer-motion";
import { Button } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import { aiButtonBase } from "../../shared/styles/buttons.jsx";
import { START_DEG, END_DEG, ORBIT_DURATION } from "./constants";
import { posFromAngle, cwDelta } from "./utils";

let persistedAngle = START_DEG;

const OrbitingAiButton = ({
  isLoadingReading,
  reading,
  showAiView,
  onGetReading,
  setShowAiView,
  btnSize,
}) => {
  const [isPresent, safeToRemove] = usePresence();

  const initialAngle = reading ? persistedAngle : START_DEG;
  const angle = useMotionValue(initialAngle);

  const xOffset = useMotionValue(0);
  const yOffset = useMotionValue(0);
  const opacity = useMotionValue(0);

  const animRef = useRef(null);
  const readingRef = useRef(reading);

  useEffect(() => {
    readingRef.current = reading;
  }, [reading]);

  const leftVal = useTransform(
    angle,
    (deg) => posFromAngle(deg, btnSize).left + "px",
  );

  const topVal = useTransform(
    angle,
    (deg) => posFromAngle(deg, btnSize).top + "px",
  );

  useEffect(() => {
    if (!reading) {
      xOffset.set(-100);
      yOffset.set(40);
    } else {
      xOffset.set(100);
      yOffset.set(40);
    }

    opacity.set(0);

    animateMotion(xOffset, 0, { duration: 1, ease: "easeOut" });
    animateMotion(yOffset, 0, { duration: 1, ease: "easeOut" });
    animateMotion(opacity, 1, { duration: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPresent) {
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }

      if (!readingRef.current) {
        animateMotion(xOffset, -100, { duration: 1, ease: "easeIn" });
        animateMotion(yOffset, 40, { duration: 1, ease: "easeIn" });
      } else {
        animateMotion(xOffset, 100, { duration: 1, ease: "easeIn" });
        animateMotion(yOffset, 40, { duration: 1, ease: "easeIn" });
      }

      animateMotion(opacity, 0, {
        duration: 0.4,
        onComplete: () => {
          persistedAngle = angle.get();
          safeToRemove();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  useEffect(() => {
    if (!isPresent) return;

    if (isLoadingReading) {
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }

      const start = angle.get();

      animRef.current = animateMotion(angle, start + 360, {
        duration: ORBIT_DURATION,
        ease: "linear",
        repeat: Infinity,
      });
    } else {
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;

        const current = angle.get();
        const delta = cwDelta(current, END_DEG);

        if (delta > 1) {
          const duration = Math.max(0.2, (delta / 360) * ORBIT_DURATION);

          animRef.current = animateMotion(angle, current + delta, {
            duration,
            ease: "easeOut",
            onComplete: () => {
              angle.set(END_DEG);
              persistedAngle = END_DEG;
              animRef.current = null;
            },
          });
        } else {
          angle.set(END_DEG);
          persistedAngle = END_DEG;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingReading, isPresent]);

  const getAiButtonText = () => {
    if (isLoadingReading) return "";
    if (!reading) return "I neeD MoRe DetAilS";
    return showAiView ? "HIdE DetAilS" : "ShOW DetAilS";
  };

  const handleClick = () => {
    if (!reading) onGetReading();
    else setShowAiView(!showAiView);
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        left: leftVal,
        top: topVal,
        x: xOffset,
        y: yOffset,
        opacity,
      }}
    >
      <Button
        {...aiButtonBase}
        whiteSpace="normal"
        onClick={handleClick}
        disabled={isLoadingReading}
      >
        {getAiButtonText()}
      </Button>
    </motion.div>
  );
};

export default OrbitingAiButton;
