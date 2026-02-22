import { motion } from "framer-motion";
import { Button, Box, Flex } from "@chakra-ui/react";
import { CATEGORY_GRADIENTS } from "../../shared/constants/categories.ts";
import { getCategoryPosition } from "./utils.js";

const MotionButton = motion(Button);
const MotionDiv = motion.div;

const CategoryButton = ({
  category,
  index,
  total,
  isSelected,
  isRotating,
  isReady,
  isMobile,
  buttonStyles,
  selectedCategory,
  onClick,
}) => {
  const pos = getCategoryPosition(index, total, isSelected, isMobile);

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
          animate={{ scale: isRotating ? [1, 1.3, 1] : 1 }}
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
            onClick(category);
          }}
          pointerEvents={!isReady || isSelected ? "none" : "auto"}
          cursor={!isReady ? "default" : "pointer"}
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
              animate={{ rotate: 360, background: currentGradient }}
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
              }}
              transition={{
                background: { duration: 1.5 },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
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
};

export default CategoryButton;
