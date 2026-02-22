import { motion } from "framer-motion";
import { Box, Text } from "@chakra-ui/react";

const MotionBox = motion(Box);
const GalleryCardItem = ({ card, index, onClick }) => {
  return (
    <MotionBox
      cursor="pointer"
      whileTap={{ scale: 0.92 }}
      onClick={() => onClick(card, index)}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        h={{ base: "160px", md: "480px" }}
        w={{ base: "100px", md: "300px" }}
        bgImage={card.image ? `url('${card.image}')` : "none"}
        bgColor={!card.image ? "gray.700" : "transparent"}
        bgSize="contain"
        bgPosition="center"
        bgRepeat="no-repeat"
        borderRadius="15px"
        boxShadow="0px 0px 15px 5px rgba(255, 255, 255, 0.3)"
        transition="box-shadow 0.3s ease"
        _hover={{
          boxShadow: "0px 0px 15px 10px rgba(255, 255, 255, 0.6)",
        }}
        position="relative"
      >
        {!card.image && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontSize="sm"
          >
            No Image
          </Box>
        )}
      </Box>
      <Text
        mt="10px"
        textAlign="center"
        fontSize={{ base: "xs", md: "md" }}
        fontWeight="bold"
        color="white"
        textShadow="2px 2px 4px black"
      >
        {card.name || `Card ${card.id}`}
      </Text>
    </MotionBox>
  );
};

export default GalleryCardItem;
