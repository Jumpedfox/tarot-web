import { Box, Text } from "@chakra-ui/react";
import { CARD_DIMENSIONS } from "./constants.js";

const CardImage = ({ card, rotation }) => {
  return (
    <Box
      h={CARD_DIMENSIONS.height}
      w={CARD_DIMENSIONS.width}
      borderRadius="15px"
      bgImage={`url('${card.image}')`}
      bgSize="contain"
      transform={`rotate(${rotation}deg)`}
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      overflow="hidden"
      boxShadow="0px 0px 20px 10px rgba(0, 0, 0, 0.5)"
      transition="box-shadow 0.3s ease"
      cursor="pointer"
    >
      <Text
        p="1"
        textAlign="center"
        fontSize={{ base: "xs", md: "xl" }}
        fontWeight="bold"
        textShadow="2px 2px 4px black"
        cursor="pointer"
      >
        {card.name}
      </Text>
    </Box>
  );
};

export default CardImage;
