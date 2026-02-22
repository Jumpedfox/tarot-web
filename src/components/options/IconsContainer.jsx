import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";
import RotatingIcon from "./RotatingIcon.jsx";
import { ICONS } from "./constants.js";

const MotionBox = motion(Box);

const IconsContainer = () => (
  <MotionBox
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 10 } }}
    exit={{ opacity: 0, transition: { duration: 1 } }}
  >
    <Box
      position="absolute"
      left="50%"
      top="2%"
      w="95%"
      h="95%"
      borderRadius="50%"
      transform="translate(-50%, -50%)"
      animation="rotate 180s linear infinite"
      pointerEvents="none"
    >
      {ICONS.map((icon, idx) => (
        <RotatingIcon key={idx} icon={icon} index={idx} />
      ))}
    </Box>
  </MotionBox>
);

export default IconsContainer;
