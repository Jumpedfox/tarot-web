import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Flex } from "@chakra-ui/react";
import { useOraclepage } from "./hooks/useOraclepage.js";
import CardsList from "./CardsList.jsx";
import ControlButtons from "./ControlButtons.jsx";
import Meaning from "../meaning/index.jsx";

const MotionBox = motion(Box);

const Oraclepage = () => {
  const navigate = useNavigate();
  const {
    numberOfCards,
    card1,
    card2,
    card3,
    meaningIsVisible,
    twists,
    rotations,
    activeCard,
    previousCard,
    cardsHaveBeenShown,
    showCategories,
    setShowCategories,
    showAiView,
    setShowAiView,
    reading,
    isLoadingReading,
    buttonConfig,
    resetCards,
    handleGetReading,
    handleCardClick,
    handleCategoryClick,
  } = useOraclepage();

  return (
    <MotionBox
      h={{ base: "100dvh", md: "auto" }}
      w="full"
      maxW="1000px"
      display="flex"
      flexDirection="column"
      justifyContent={{ base: "flex-start", md: "center" }}
      alignItems="center"
      color="white"
      position="relative"
      p={{ base: "16px 14px", md: "20px 40px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Flex
        w="full"
        justifyContent="center"
        alignItems="center"
        position="relative"
        flex="1"
        minH="0"
        mb="40px" 
      >
        <AnimatePresence mode="wait">
          {meaningIsVisible && card1 ? (
            <Meaning
              key="meaning"
              rotate1={rotations[1]}
              rotate2={rotations[2]}
              rotate3={rotations[3]}
              showAiView={showAiView}
            />
          ) : (
            <CardsList
              key="cards"
              cards={[card1, card2, card3]}
              twists={twists}
              rotations={rotations}
              activeCard={activeCard}
              previousCard={previousCard}
              onCardClick={handleCardClick}
              cardsHaveBeenShown={cardsHaveBeenShown}
            />
          )}
        </AnimatePresence>
      </Flex>

      <Box flexShrink="0" w="100%">
        <ControlButtons
          onBackClick={() => navigate("/")}
          buttonConfig={buttonConfig}
          showCategories={showCategories}
          card1={card1}
          onCategoryClick={handleCategoryClick}
          onResetClick={resetCards}
          numberOfCards={numberOfCards}
          card3={card3}
          setShowCategories={setShowCategories}
          reading={reading}
          isLoadingReading={isLoadingReading}
          onGetReading={handleGetReading}
          showAiView={showAiView}
          setShowAiView={setShowAiView}
        />
      </Box>
    </MotionBox>
  );
};

export default Oraclepage;
