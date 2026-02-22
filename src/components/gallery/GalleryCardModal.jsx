import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, Text, useBreakpointValue } from "@chakra-ui/react";
import {
  oracleButtonStyles,
  oracleSmallButtonStyles,
} from "../../shared/styles/buttons.jsx";
import { useMemo, useEffect } from "react";
import throttle from "lodash/throttle";
import { spinKeyframes } from "./constants.js";

const MotionBox = motion(Box);

const GalleryCardModal = ({
  card,
  direction,
  variants,
  onClose,
  onNext,
  onPrev,
}) => {
  const throttledNext = useMemo(
    () => throttle(onNext, 1000, { leading: true, trailing: false }),
    [onNext],
  );
  const throttledPrev = useMemo(
    () => throttle(onPrev, 1000, { leading: true, trailing: false }),
    [onPrev],
  );
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    return () => {
      throttledNext.cancel();
      throttledPrev.cancel();
    };
  }, [throttledNext, throttledPrev]);

  return (
    <MotionBox
      key="modal-overlay"
      position="fixed"
      inset="0"
      bg="rgba(0, 0, 0, 0.9)"
      zIndex="1000"
      display="flex"
      alignItems="center"
      justifyContent="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {isMobile && (
        <Button
          {...oracleSmallButtonStyles}
          position="absolute"
          w="40px"
          h="40px"
          bottom="10px"
          left="50%"
          transform="translateX(-50%)"
          color="black"
          zIndex={10}
          onClick={onClose}
        >
          ✕
        </Button>
      )}

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        maxW="100vw"
        px="20px"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          {...oracleButtonStyles}
          borderRadius="4px"
          bgImage="linear-gradient(45deg, white 0%, transparent 50%)"
          onClick={throttledPrev}
          boxShadow="none"
          transform={{ base: "rotate(45deg) scale(0.5)", md: "rotate(45deg)" }}
          zIndex={5}
          mr="-60px"
        />

        <Box display="flex" flexDirection="column" alignItems="center">
          <AnimatePresence custom={direction} initial={false}>
            <MotionBox
              key={card.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ perspective: 1000 }}
            >
              <Box
                position="relative"
                h={{ base: "64vh", md: "80vh" }}
                w={{ base: "40vh", md: "50vh" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  position="absolute"
                  inset="-10px"
                  borderRadius="25px"
                  zIndex="0"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background:
                      "conic-gradient(from 0deg, red, orange, yellow, green, cyan, blue, magenta, red)",
                    animation: "spin-glow 6s linear infinite",
                  }}
                  filter="blur(25px) opacity(0.7)"
                />
                <Box
                  position="relative"
                  zIndex="1"
                  h="100%"
                  w="100%"
                  bgImage={card.image ? `url('${card.image}')` : "none"}
                  bgColor={!card.image ? "gray.700" : "transparent"}
                  bgSize="cover"
                  bgPosition="center"
                  borderRadius="15px"
                  boxShadow="inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.2)"
                  sx={{
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: "0",
                      borderRadius: "15px",
                      boxShadow: "0 0 40px 5px rgba(255, 255, 255, 0.1)",
                      pointerEvents: "none",
                    },
                  }}
                />
                <style>{spinKeyframes}</style>
              </Box>
              <Text
                mt="20px"
                textAlign="center"
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                textShadow="0px 0px 10px rgba(255, 255, 255, 0.8)"
              >
                {card.name}
              </Text>
            </MotionBox>
          </AnimatePresence>
        </Box>

        <Button
          {...oracleButtonStyles}
          ml="-60px"
          borderRadius="4px"
          bgImage="linear-gradient(225deg, white 0%, transparent 50%)"
          onClick={throttledNext}
          boxShadow="none"
          transform={{ base: "rotate(45deg) scale(0.5)", md: "rotate(45deg)" }}
          zIndex={5}
        />
      </Box>
    </MotionBox>
  );
};

export default GalleryCardModal;
