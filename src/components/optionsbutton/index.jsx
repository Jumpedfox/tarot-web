import { Box, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import spiral from "../../images/spiral2.png";
import { useEffect, useRef } from "react";
import { setOptionsVisibility } from "../../redux/slices/uiSlice.ts";

const MotionBox = motion(Box);

const OptionsButton = () => {
  const dispatch = useDispatch();
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  const optionsAreVisible = useSelector((state) => state.ui.optionsAreVisible);

  const theme = useSelector((state) => state.theme.themeName);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <AnimatePresence>
      {!optionsAreVisible && (
        <MotionBox
          key="options-button"
          as="button"
          position="absolute"
          left="50%"
          bottom={isMobile ? "-40px" : "-100px"}
          w={isMobile ? "120px" : "250px"}
          h={isMobile ? "120px" : "250px"}
          border="none"
          outline="none"
          cursor="pointer"
          style={{ transformOrigin: "center center" }}
          initial={
            firstRender.current
              ? false
              : { x: "-50%", y: -300, opacity: 0, scale: 3 }
          }
          animate={{
            x: "-50%",
            y: 20,
            opacity: 1,
            scale: 1,
            transition: { duration: 1.5 },
          }}
          exit={{
            x: "-50%",
            y: -300,
            opacity: 0,
            scale: 3,
            transition: { duration: 0.8 },
          }}
          onClick={() => dispatch(setOptionsVisibility(true))}
        >
          <MotionBox
            w="100%"
            h="100%"
            bgImage={`url(${spiral})`}
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPos="center"
            opacity="0.9"
            filter={theme === "bright" ? "none" : "brightness(0.7)"}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default OptionsButton;
