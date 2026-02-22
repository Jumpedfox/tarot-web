import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  HStack,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { setNumberOfCards } from "../../redux/slices/cardsSlice.ts";
import { setManualIsVisible } from "../../redux/slices/uiSlice.ts";
import {
  menuButtonStyles,
  oracleButtonStyles,
  oracleSmallButtonStyles,
  smallButtonStyles,
} from "../../shared/styles/buttons.jsx";

const MotionBox = motion(Box);

const Mainmenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const manualIsVisible = useSelector((state) => state.ui.manualIsVisible);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleNumberOfCardsChange = (number) => {
    localStorage.setItem("numberOfCards", number);
    dispatch(setNumberOfCards(number));
    navigate("/oracle");
  };

  const toggleManualVisibility = () => {
    dispatch(setManualIsVisible(!manualIsVisible));
  };

  const handleGalleryClick = () => {
    navigate("/gallery");
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      w="full"
      justifyContent="center"
      maxW="800px"
    >
      <VStack minH="100%" align="center">
        <HStack w="full" justify="space-evenly" px={10}>
          <Button
            {...(isMobile ? oracleButtonStyles : menuButtonStyles)}
            onClick={() => handleNumberOfCardsChange(1)}
          >
            <Box
              w="100px"
              h="100px"
              bgImage="url(https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/icon1card.png)"
              bgSize="contain"
              bgRepeat="no-repeat"
              transition="1s"
            />
          </Button>
          <Button
            {...(isMobile ? oracleButtonStyles : menuButtonStyles)}
            onClick={() => handleNumberOfCardsChange(3)}
          >
            <Box
              w="100px"
              h="100px"
              bgImage="url(https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/icons/icon3cards.png)"
              bgSize="contain"
              bgRepeat="no-repeat"
              transition="1s"
            />
          </Button>
        </HStack>

        <HStack w="100%" justify="space-between" p="10px">
          <Button
            {...(isMobile ? oracleSmallButtonStyles : smallButtonStyles)}
            onClick={toggleManualVisibility}
          >
            {" "}
            GUidE
          </Button>

          <Button
            {...(isMobile ? oracleSmallButtonStyles : smallButtonStyles)}
            onClick={handleGalleryClick}
          >
            GAlleY
          </Button>
        </HStack>
      </VStack>
    </MotionBox>
  );
};

export default Mainmenu;
