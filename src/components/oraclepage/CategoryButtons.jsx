import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Box, useBreakpointValue, Flex } from "@chakra-ui/react";
import {
  oracleButtonStyles,
  oracleSmallButtonStyles,
} from "../../shared/styles/buttons.jsx";
import {
  CATEGORIES,
  CATEGORY_GRADIENTS,
} from "../../shared/constants/categories.ts";
import { ARC_CONFIG, CIRCLE_CONFIG } from "./utils.js";
import { closeButtonStyles, rotationTransition } from "./constants.js";

const MotionButton = motion(Button);
const MotionDiv = motion.div;
const getCategoryPosition = (index, total, isSelected, isMobile) => {
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

const CategoryButtons = ({ onCategoryClick, setShowCategories }) => {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const timeoutRef = useRef(null);
  const isRotatingRef = useRef(false);
  const isSelectedRef = useRef(false);

  useEffect(() => {
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, CATEGORIES.length * 200);

    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const rotationTimeout = setTimeout(() => {
      setIsRotating(true);
      isRotatingRef.current = true;
    }, 1000);

    return () => clearTimeout(rotationTimeout);
  }, [selectedCategory]);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClose = () => {
    if (isRotatingRef.current || isSelectedRef.current) return;
    setIsClosing(true);
    setTimeout(() => {
      if (!isMountedRef.current) return;
      setShowCategories(false);
    }, 500);
  };

  const handleClick = (category) => {
    if (!isReady || isRotatingRef.current || selectedCategory) return;

    isSelectedRef.current = true;
    setSelectedCategory(category);

    const randomDelay = Math.floor(Math.random() * (12000 - 6000 + 1)) + 6000;

    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setIsClosing(true);
      setTimeout(() => {
        onCategoryClick(category);
      }, 800);
    }, randomDelay);
  };

  const isSelected = selectedCategory !== null;
  const buttonStyles = isMobile ? oracleSmallButtonStyles : oracleButtonStyles;

  return (
    <AnimatePresence>
      {!isClosing && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="3"
        >
          <MotionDiv
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "1px",
              height: "1px",
            }}
            animate={{ rotate: isRotating ? 360 : 0 }}
            transition={{ rotate: rotationTransition }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.8 } }}
          >
            <AnimatePresence>
              {isReady && !isSelected && (
                <MotionDiv
                  style={{
                    position: "absolute",
                    top: -45,
                    left: -45,
                    zIndex: 10,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <Button {...closeButtonStyles} onClick={handleClose}>
                    ✕
                  </Button>
                </MotionDiv>
              )}
            </AnimatePresence>

            {CATEGORIES.map((category, index) => {
              const pos = getCategoryPosition(
                index,
                CATEGORIES.length,
                isSelected,
                isMobile,
              );

              const currentGradient = isSelected
                ? CATEGORY_GRADIENTS[selectedCategory]
                : CATEGORY_GRADIENTS[category];

              return (
                <MotionDiv
                  key={category}
                  style={{ position: "absolute", top: 0, left: 0 }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x: pos.x, y: pos.y, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 40,
                    damping: 5,
                    delay: index * 0.1,
                  }}
                >
                  <Flex
                    style={{
                      position: "absolute",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <MotionButton
                      {...buttonStyles}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: isRotating ? [1, 1.3, 1] : 1,
                      }}
                      transition={{
                        scale: isRotating
                          ? {
                              duration: 2.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.4,
                            }
                          : {
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                              delay: isSelected ? 0 : index * 0.1,
                            },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected && !isRotatingRef.current) {
                          handleClick(category);
                        }
                      }}
                      pointerEvents={
                        !isReady || isSelected || isRotatingRef.current
                          ? "none"
                          : "auto"
                      }
                      cursor={
                        !isReady || isRotatingRef.current
                          ? "default"
                          : "pointer"
                      }
                      zIndex="3"
                    >
                      <Box
                        position="absolute"
                        inset="-10px"
                        borderRadius="50%"
                        zIndex="-1"
                        overflow="hidden"
                        filter="blur(20px)"
                      >
                        <MotionDiv
                          animate={{
                            rotate: 360,
                            background: currentGradient,
                          }}
                          style={{
                            position: "absolute",
                            top: "-50%",
                            left: "-50%",
                            width: "200%",
                            height: "200%",
                          }}
                          transition={{
                            background: { duration: 1.5 },
                            rotate: {
                              duration: 10,
                              repeat: Infinity,
                              ease: "linear",
                            },
                          }}
                        />
                      </Box>

                      {!isSelected && (
                        <Box position="relative" zIndex="1" whiteSpace="nowrap">
                          {category}
                        </Box>
                      )}
                    </MotionButton>
                  </Flex>
                </MotionDiv>
              );
            })}
          </MotionDiv>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default CategoryButtons;
