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

const Gallery = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState(
    Array.from({ length: MAX_CARDS }).map((_, i) => ({
      id: `placeholder-${i}`,
      card: null,
    })),
  );

  const [cards, setCards] = useState([]);

  const {
    selectedCard,
    direction,
    handleCardClick,
    handleClose,
    handleNext,
    handlePrevious,
  } = useCardNavigation(cards);

  useEffect(() => {
    const fetchCards = async () => {
      const results = await cardsService.getAllCards(MAX_CARDS);
      await Promise.all(results.map((card) => preloadImage(card.image)));
      setCards(results);
      for (let i = 0; i < results.length; i++) {
        await new Promise((res) => setTimeout(res, 100));

        setItems((prev) => {
          const copy = [...prev];
          copy[i] = {
            id: results[i].id,
            card: results[i],
          };
          return copy;
        });
      }
    };

    fetchCards();
  }, []);

  return (
    <MotionBox minH="100dvh" w="100%" maxW="1400px" mx="auto" pt="20px">
      <Flex justifyContent="center" alignItems="center">
        <Button
          mr="16px"
          ml="20px"
          fontSize="40px"
          color="white"
          onClick={() => navigate("/")}
          variant="plain"
          w="30px"
        >
          ᐊ
        </Button>

        <Text fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold" mr="70px">
          Tarot Cards Gallery
        </Text>
      </Flex>

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
            {items.map((item, index) => (
              <Box key={item.id} position="relative">
                <AnimatePresence mode="wait">
                  {!item.card ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <GalleryCardSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GalleryCardItem
                        card={item.card}
                        index={index}
                        onClick={handleCardClick}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            ))}
          </Box>
        </ScrollArea.Viewport>
      </ScrollArea.Root>

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
