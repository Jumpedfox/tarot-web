import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";
import CardImage from "./CardImage.jsx";
import { useCardPosition } from "./useCardPosition.js";
import { CARD_DIMENSIONS } from "./constants.js";

const MotionBox = motion(Box);

const Card = ({
  card,
  cardNumber,
  twist,
  isActive,
  isPrevious,
  rotation,
  onClick,
  skipPositionAnimation,
}) => {
  const { positionStyle, zIndex } = useCardPosition(
    cardNumber,
    isActive,
    isPrevious,
  );

  return (
    <MotionBox
      position="absolute"
      bottom="5%"
      h={CARD_DIMENSIONS.height}
      w={CARD_DIMENSIONS.width}
      zIndex={zIndex}
      initial={{
        opacity: 0,
        ...(skipPositionAnimation
          ? { ...positionStyle, rotate: twist }
          : { left: "50%", x: "-50%" }),
        scale: 1,
      }}
      animate={{
        opacity: 1,
        rotate: twist,
        ...positionStyle,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        zIndex: { duration: 0 },
      }}
      onClick={onClick}
    >
      <CardImage card={card} rotation={rotation} />
    </MotionBox>
  );
};

export default Card;
