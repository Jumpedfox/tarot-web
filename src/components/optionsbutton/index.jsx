import { Box, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setOptionsVisibility } from "../../redux/slices/uiSlice.ts";
import BlackHole from "../cosmos/BlackHole.jsx";
import { MENU_BUTTON } from "../cosmos/geometry.js";

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
  const { size, bottom } = isMobile ? MENU_BUTTON.mobile : MENU_BUTTON.desktop;

  return (
    <AnimatePresence>
      {!optionsAreVisible && (
        <MotionBox
          key="options-button"
          as="button"
          aria-label="Open menu"
          position="absolute"
          left="50%"
          bottom={`${bottom}px`}
          w={`${size}px`}
          h={`${size}px`}
          p="0"
          bg="transparent"
          borderRadius="full"
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
            y: MENU_BUTTON.restY,
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
          <Box
            position="absolute"
            inset="0"
            opacity="0.9"
            filter={theme === "bright" ? "none" : "brightness(0.7)"}
            transition="filter 3s"
          >
            <BlackHole size={size} />
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default OptionsButton;
