import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, Flex, useBreakpointValue } from "@chakra-ui/react";
import CategoryButtons from "./CategoryButtons.jsx";
import {
  oracleButtonStyles,
  oracleSmallButtonStyles,
} from "../../shared/styles/buttons.jsx";
import OrbitingAiButton from "./OrbitingAiButton";

const ControlButtons = ({
  onBackClick,
  buttonConfig,
  showCategories,
  card1,
  onCategoryClick,
  onResetClick,
  numberOfCards,
  card3,
  setShowCategories,
  reading,
  isLoadingReading,
  onGetReading,
  showAiView,
  setShowAiView,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const showAiButton = buttonConfig.text === "Hide Meaning";
  const btnSize = 120;

  const handleResetClick = () => {
    onResetClick();
  };

  return (
    <Flex w="100%" justify="space-around" align="flex-end" wrap="wrap" gap={4}>
      <Button {...oracleSmallButtonStyles} onClick={onBackClick}>
        Back
      </Button>

      <Box position="relative" mb={isMobile ? "80px" : "130px"}>
        <AnimatePresence>
          {showAiButton && (
            <OrbitingAiButton
              key="ai-button"
              isLoadingReading={isLoadingReading}
              reading={reading}
              showAiView={showAiView}
              onGetReading={onGetReading}
              setShowAiView={setShowAiView}
              btnSize={btnSize}
            />
          )}
        </AnimatePresence>

        <Button
          {...oracleButtonStyles}
          onClick={buttonConfig.onClick}
          disabled={buttonConfig.disabled || showCategories}
        >
          <motion.div
            key={buttonConfig.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {buttonConfig.text}
          </motion.div>
        </Button>

        <AnimatePresence>
          {showCategories && !card1 && (
            <CategoryButtons
              onCategoryClick={onCategoryClick}
              setShowCategories={setShowCategories}
            />
          )}
        </AnimatePresence>
      </Box>

      <Button
        {...oracleSmallButtonStyles}
        onClick={handleResetClick}
        disabled={numberOfCards === 3 ? !card3 : !card1}
      >
        Reset
      </Button>
    </Flex>
  );
};

export default ControlButtons;
