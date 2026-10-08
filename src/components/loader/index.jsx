import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Image, Spinner } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { setLoaderIsVisible } from "../../redux/slices/uiSlice.ts";

const MotionBox = motion(Box);
const FADE_DURATION = 2000;
const EYE_ICON =
  "https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/iconeye.png";

// Resolves once an image is downloaded and decoded (or failed to load).
const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });

const Loader = () => {
  const dispatch = useDispatch();
  const [showEye, setShowEye] = useState(false);
  const [fadeout, setFadeout] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    Promise.all([document.fonts.ready, loadImage(EYE_ICON)]).then(() => {
      setShowEye(true);
    });
  }, []);

  // The click on the eye is also the user gesture browsers require before a
  // page may play sound, so the music starts with it.
  const handleClick = () => {
    if (!showEye) return;
    setFadeout(true);
    timeoutRef.current = setTimeout(
      () => dispatch(setLoaderIsVisible(false)),
      FADE_DURATION,
    );
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <MotionBox
      position="fixed"
      inset="0"
      bg="black"
      zIndex={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      animate={{ opacity: fadeout ? 0 : 1 }}
      transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
      pointerEvents={fadeout ? "none" : "auto"}
    >
      <AnimatePresence mode="wait">
        {!showEye ? (
          <MotionBox
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Spinner
              size="xl"
              color="rgba(0, 119, 255, 0.8)"
              thickness="3px"
              speed="1.2s"
              w="150px"
              h="150px"
              style={{
                filter:
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.3))",
              }}
            />
          </MotionBox>
        ) : (
          <MotionBox
            key="eye"
            as="button"
            aria-label="Enter"
            onClick={handleClick}
            w="150px"
            h="150px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            outline="none"
            bg="transparent"
            border="none"
            padding={0}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [0.95, 1.05, 0.95] }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={EYE_ICON}
              alt="Eye Icon"
              w="100%"
              h="100%"
              objectFit="contain"
              pointerEvents="none"
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default Loader;
