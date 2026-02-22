import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Flex, Box, Text, Heading, useBreakpointValue } from "@chakra-ui/react";
import { ScrollArea } from "@chakra-ui/react";
import { SCROLL_MASK_STYLES } from "../gallery/constants";
import { CATEGORY_MAP } from "../../shared/constants/categories.ts";
import { glowShadow } from "../../shared/styles/shadows.js";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

const Meaning = ({ rotate1, rotate2, rotate3, showAiView }) => {
  const { numberOfCards, cards, selectedCategory, aiReading } = useSelector(
    (state) => state.cards,
  );

  const [card1, card2, card3] = cards;

  const cardData = [
    { card: card1, rotation: rotate1 },
    { card: card2, rotation: rotate2 },
    { card: card3, rotation: rotate3 },
  ];
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const meaningKey = CATEGORY_MAP[selectedCategory] || "about";

  return (
    <ScrollArea.Root maxH={{ base: "80vh", md: "70vh" }} w="100%">
      <ScrollArea.Viewport
        css={SCROLL_MASK_STYLES}
        justifyContent={numberOfCards === 1 && isDesktop ? "center" : "start"}
      >
        <MotionFlex
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          w="100%"
          direction="column"
          align="center"
          gap="40px"
          p={{ base: "30px", md: "40px" }}
          mx="auto"
        >
          <AnimatePresence mode="wait">
            {!showAiView ? (
              <MotionBox
                key="meanings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                w="100%"
              >
                <Flex
                  w="100%"
                  align="flex-start"
                  gap={{ base: "0", md: "20px" }}
                  pt="20px"
                  direction={{ base: "column", md: "row" }}
                  justifyContent="center"
                >
                  {cardData.map(
                    ({ card, rotation }, index) =>
                      card && (
                        <Box
                          key={index}
                          flex="1"
                          display="flex"
                          flexDirection="column"
                          maxW={{ base: "100%", md: "300px" }}
                          alignItems="center"
                          textAlign="center"
                          w="100%"
                        >
                          <Heading
                            size={{ base: "2xl", md: "4xl" }}
                            mb="5px"
                            fontWeight="black"
                            color="white"
                            textShadow="0 0 10px rgba(255,255,255,0.5)"
                          >
                            {card.name}
                          </Heading>
                          {rotation > 0 && (
                            <Text
                              fontSize="14px"
                              fontStyle="italic"
                              color="#ff9e9e"
                              mb="10px"
                            >
                              (reversed)
                            </Text>
                          )}
                          <Text
                            fontWeight="bold"
                            fontSize={{ base: "16px", md: "18px" }}
                            color="#e0e0e0"
                            textShadow="0 0 2px black, 0 0 1em black, 0 0 0.5em white"
                            mb="20px"
                          >
                            {rotation > 0
                              ? card.meaning_rev[meaningKey]
                              : card.meaning_up[meaningKey]}
                          </Text>
                        </Box>
                      ),
                  )}
                </Flex>
              </MotionBox>
            ) : (
              <MotionBox
                key="ai-reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                w="full"
                maxW="700px"
                textAlign="center"
              >
                <Text
                  fontWeight="black"
                  fontSize={{ base: "15px", md: "18px" }}
                  textShadow={glowShadow}
                  fontStyle="italic"
                  lineHeight="1.5"
                >
                  {aiReading}
                </Text>
              </MotionBox>
            )}
          </AnimatePresence>
        </MotionFlex>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};

export default Meaning;
