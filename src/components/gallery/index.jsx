import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, Box, Button, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCardNavigation } from "./hooks.jsx";
import GalleryCardSkeleton from "./GalleryCardSkeleton.jsx";
import GalleryCardItem from "./GalleryCardItem.jsx";
import GalleryCardModal from "./GalleryCardModal.jsx";
import { MAX_CARDS, SCROLL_MASK_STYLES, variants } from "./constants.js";
import { cardsService } from "../../services/cards.service.ts";
import { preloadImage } from "../../shared/utils/preloadImage.ts";

const MotionBox = motion(Box);
const SKELETON_COUNT = Math.floor(Math.ceil(window.innerHeight / 160) * 3);

const Gallery = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    selectedCard,
    direction,
    handleCardClick,
    handleClose,
    handleNext,
    handlePrevious,
  } = useCardNavigation(cards);

  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      const results = await cardsService.getAllCards(MAX_CARDS);
      await Promise.all(results.map((card) => preloadImage(card.image)));
      setCards(results);
      setLoading(false);
    };

    fetchAllCards();
  }, []);

  return (
    <MotionBox minH="100dvh" w="100%" maxW="1400px" mx="auto" pt="20px">
      <Flex justifyContent="center" textAlign="center">
        <Button
          ml="20px"
          mt="3px"
          fontSize="40px"
          color="white"
          onClick={() => navigate("/")}
          variant="ghost"
          w="30px"
        >
          ᐊ
        </Button>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          lineHeight={{ base: "1", md: "1.5" }}
          color="white"
          mr="70px"
        >
          Tarot Cards Gallery
        </Text>
      </Flex>

      <AnimatePresence mode="popLayout">
        {loading && (
          <MotionBox
            key="loading"
            display="grid"
            gridTemplateColumns={{
              base: "repeat(3, 1fr)",
              md: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
            maxH="80dvh"
            gap={4}
            w="100%"
            p="40px 20px"
            css={SCROLL_MASK_STYLES}
          >
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GalleryCardSkeleton />
              </MotionBox>
            ))}
          </MotionBox>
        )}

        {!loading && cards.length === 0 && (
          <MotionBox
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Text textAlign="center" fontSize="xl" color="white">
              The cards are unavailable at this time. Please try again later.
            </Text>
          </MotionBox>
        )}

        {!loading && cards.length > 0 && (
          <MotionBox key="cards">
            <ScrollArea.Root maxH="80dvh" w="100%">
              <ScrollArea.Viewport css={SCROLL_MASK_STYLES}>
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: "repeat(3, 1fr)",
                    md: "repeat(auto-fill, minmax(300px, 1fr))",
                  }}
                  gap={4}
                  p="40px 20px"
                >
                  {cards.map((card, index) => (
                    <MotionBox
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    >
                      <GalleryCardItem
                        card={card}
                        index={index}
                        onClick={handleCardClick}
                      />
                    </MotionBox>
                  ))}
                </Box>
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </MotionBox>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} custom={direction}>
        {selectedCard && (
          <GalleryCardModal
            card={selectedCard}
            direction={direction}
            variants={variants}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrevious}
          />
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default Gallery;
