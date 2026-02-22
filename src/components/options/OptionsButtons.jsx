import { motion } from "framer-motion";
import { Box, Button, useBreakpointValue, VStack } from "@chakra-ui/react";
import {
  buttonStyles,
  activeButtonStyles,
} from "../../shared/styles/buttons.jsx";
import VolumeKnob from "./Volumeknob.jsx";

const MotionBox = motion(Box);

const OptionsButtons = ({ config }) => {
  const {
    musicIsMuted,
    onlyMajorArcana,
    themeName,
    musicVolume,
    onMuteToggle,
    onArcanaToggle,
    onThemeToggle,
    onVolumeChange,
    onClose,
    isClosing,
  } = config;

  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
      as={VStack}
      h="fit-content"
      justify="space-evenly"
      zIndex={5}
      gap={5}
      pointerEvents={isClosing ? "none" : "auto"}
    >
      {!isMobile && (
        <VolumeKnob
          value={musicVolume}
          onChange={onVolumeChange}
          onMuteToggle={onMuteToggle}
          isMuted={musicIsMuted}
        />
      )}

      {isMobile && (
        <Button
          {...(musicIsMuted ? activeButtonStyles : buttonStyles)}
          onClick={onMuteToggle}
        >
          {musicIsMuted ? "UnmutE" : "MutE"}
        </Button>
      )}

      <Button
        {...(onlyMajorArcana ? activeButtonStyles : buttonStyles)}
        onClick={onArcanaToggle}
      >
        Only Major arcanA
      </Button>

      <Button
        {...(themeName === "bright" ? activeButtonStyles : buttonStyles)}
        onClick={onThemeToggle}
      >
        ThemE
      </Button>

      <Button {...buttonStyles} onClick={onClose}>
        ClosE MenU
      </Button>
    </MotionBox>
  );
};
export default OptionsButtons;
