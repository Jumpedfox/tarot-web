import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Spinner } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { setLoaderIsVisible } from "../../redux/slices/uiSlice.ts";

const MotionBox = motion(Box);
const BG_FADE_DURATION = 1.5;
const SPINNER_DELAY = 1000;
const SPINNER_FADE_DURATION = 0.8;

const Loader = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setLoaded(true);
      timeoutRef.current = setTimeout(() => {
        setShowSpinner(false);
        setTimeout(
          () => dispatch(setLoaderIsVisible(false)),
          SPINNER_FADE_DURATION * 1000,
        );
      }, SPINNER_DELAY);
    });

    return () => clearTimeout(timeoutRef.current);
  }, [dispatch]);

  return (
    <MotionBox
      position="fixed"
      inset="0"
      bg="black"
      zIndex={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      animate={{ opacity: loaded ? 0 : 1 }}
      transition={{ duration: BG_FADE_DURATION, ease: "easeInOut" }}
      pointerEvents={loaded ? "none" : "auto"}
    >
      <AnimatePresence>
        {showSpinner && (
          <MotionBox
            key="spinner"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPINNER_FADE_DURATION }}
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
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default Loader;
