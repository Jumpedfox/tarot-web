import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Box, Center } from "@chakra-ui/react";
import { setOnlyMajorArcana } from "../../redux/slices/cardsSlice.ts";
import { setVolume, setMuted } from "../../redux/slices/soundSlice.ts";
import { setThemeName } from "../../redux/slices/themeSlice.ts";
import { setOptionsVisibility } from "../../redux/slices/uiSlice.ts";
import OptionsButtons from "./OptionsButtons.jsx";
import IconsContainer from "./IconsContainer.jsx";
import { useState } from "react";

const MotionBox = motion(Box);
const MotionCenter = motion(Center);

const Options = () => {
  const dispatch = useDispatch();

  const musicVolume = useSelector((state) => state.sound.volume);
  const musicIsMuted = useSelector((state) => state.sound.muted);
  const onlyMajorArcana = useSelector((state) => state.cards.onlyMajorArcana);
  const themeName = useSelector((state) => state.theme.themeName);
  const [isClosing, setIsClosing] = useState(false);

  const handleVolumeChange = (volume) => {
    dispatch(setVolume(volume));
  };

  const handleMuteToggle = () => {
    dispatch(setMuted(!musicIsMuted));
  };

  const handleArcanaToggle = () => {
    dispatch(setOnlyMajorArcana(!onlyMajorArcana));
  };

  const handleThemeToggle = () => {
    dispatch(setThemeName(themeName === "bright" ? "dark" : "bright"));
  };

  const handleClose = () => {
    setIsClosing(true);
    dispatch(setOptionsVisibility(false));
  };

  const config = {
    musicIsMuted,
    onlyMajorArcana,
    themeName,
    musicVolume,
    onMuteToggle: handleMuteToggle,
    onArcanaToggle: handleArcanaToggle,
    onThemeToggle: handleThemeToggle,
    onVolumeChange: handleVolumeChange,
    onClose: handleClose,
    isClosing,
  };
  return (
    <MotionCenter
      position="absolute"
      w="full"
      h="full"
      zIndex={10}
      initial={{ backdropFilter: "blur(0px) brightness(1)" }}
      animate={{
        backdropFilter: "blur(2px) brightness(0.8)",
        transition: { duration: 2 },
      }}
      exit={{
        backdropFilter: "blur(0px) brightness(1)",
        transition: { duration: 0.5 },
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 200, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 1.5 } }}
        exit={{ opacity: 0, y: 150, scale: 0.8, transition: { duration: 0.5 } }}
        position="absolute"
        w="100dvh"
        h="100dvh"
        borderRadius="50%"
        bg="radial-gradient(circle, rgba(0, 0, 0, 0.9) 10%, rgba(2, 0, 36, 0) 70%)"
        display="flex"
        transition="1s"
        justifyContent="center"
        alignItems="center"
      >
        <OptionsButtons config={config} />
        <IconsContainer />
      </MotionBox>
    </MotionCenter>
  );
};

export default Options;
