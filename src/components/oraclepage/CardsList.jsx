import { Box } from "@chakra-ui/react";
import Card from "../card/index.jsx";

const CardsList = ({
  cards,
  twists,
  rotations,
  activeCard,
  previousCard,
  onCardClick,
  cardsHaveBeenShown,
}) => {
  return (
    <Box>
      {cards.map((card, index) => {
        const num = index + 1;
        return (
          card && (
            <Card
              key={`card-${num}`}
              card={card}
              cardNumber={num}
              twist={twists[num]}
              isActive={activeCard === num}
              isPrevious={previousCard === num}
              rotation={rotations[num]}
              onClick={() => onCardClick(num)}
              skipPositionAnimation={cardsHaveBeenShown}
            />
          )
        );
      })}
    </Box>
  );
};

export default CardsList;
