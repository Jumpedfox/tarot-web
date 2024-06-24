import { AnimatePresence, motion } from "framer-motion";
import "./card.scss";
import { useSelector } from "react-redux";

const Card = ({ card, cardNumber, twist, isActive, rotation, onClick }) => {
  const numberOfCards = useSelector((state) => state.cards.numberOfCards);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3 }}
        style={{
          transform: `rotate(${twist}deg)`,
          left:
            numberOfCards === 1
              ? "33%"
              : numberOfCards === 3 && cardNumber === 1
              ? "100px"
              : cardNumber === 2
              ? "300px"
              : cardNumber === 3 && "500px",
          zIndex: isActive ? 2 : 1,
          cursor: "pointer",
          top: cardNumber === 2 && "0",
        }}
        onClick={onClick}
      >
        <div
          className="card-pic"
          style={{
            backgroundImage: `url('${card.image}')`,
            transform: `rotate(${rotation}deg)`, 
          }}
        >
          <span>{card.name}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Card;
