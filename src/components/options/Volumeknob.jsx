import { useState, useRef, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  mixShadow,
  normalizeShadowProgress,
  shadowA,
  shadowB,
} from "./constants";

const MAX_ROTATION = 270;
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = (MAX_ROTATION / 360) * CIRCUMFERENCE;

const VolumeKnob = ({ value, onChange }) => {
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const rotation = value * MAX_ROTATION;
  const dashOffset = ARC_LENGTH - value * ARC_LENGTH;

  const calculateAngle = (clientX, clientY) => {
    if (!knobRef.current) return 0;
    const rect = knobRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const radians = Math.atan2(cx - clientX, cy - clientY);
    const deg = (radians * 180) / Math.PI;

    let final = -(deg - 135);
    final = Math.max(0, Math.min(270, final));
    return final;
  };

  const updatePointer = (e) => {
    const angle = calculateAngle(e.clientX, e.clientY);
    onChange(angle / MAX_ROTATION);
  };

  useEffect(() => {
    if (!isDragging) return;
    const move = (e) => updatePointer(e);
    const up = () => setIsDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const t = normalizeShadowProgress(value);
  const dynamicShadow = mixShadow(shadowA, shadowB, t);

  return (
    <Box textAlign="center" userSelect="none">
      <Box
        position="relative"
        w="150px"
        h="150px"
        mx="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          position="absolute"
          color="white"
          fontSize="lg"
          letterSpacing="1px"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="11"
        >
          MusIc vOLumE <br />
          {Math.round(value * 100)}%
        </Text>
        <Box
          as="svg"
          position="absolute"
          top="-1.5em"
          left="-1.5em"
          w="200px"
          h="200px"
          viewBox="0 0 200 200"
          transform="rotate(135deg)"
          pointerEvents="none"
          style={{ overflow: "visible" }}
          borderRadius="50%"
        >
          <defs>
            <linearGradient
              id="arc-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="60%"
            >
              <stop offset="0%" stopColor="#0400ff7a" />
              <stop offset="100%" stopColor="#5a5a5a00" />
            </linearGradient>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={2 + value * 6} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(16, 20, 255, 0.24)"
            strokeWidth="1"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
          />

          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth={4 + value * 4}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: "all 0.1s ease-out",
              filter: `drop-shadow(0 5px ${2 + value * 20}px #1900ff) 
                       drop-shadow(0 0 ${value * 5}px #070e72)`,
              opacity: 0.4 + value * 0.6,
            }}
          />
        </Box>

        <Box
          position="relative"
          w="100%"
          h="100%"
          borderRadius="50%"
          boxShadow={dynamicShadow}
        >
          <Box
            ref={knobRef}
            position="absolute"
            inset="0"
            borderRadius="50%"
            transform={`rotate(${rotation}deg)`}
            onPointerDown={() => setIsDragging(true)}
            cursor="grab"
            _active={{ cursor: "grabbing" }}
          >
            <Box
              position="absolute"
              bottom="19%"
              left="19%"
              w="4%"
              h="4%"
              borderRadius="50%"
              bg="#ffeafe"
              boxShadow="0 0 0.5em #79c3f4"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VolumeKnob;
