import "./meaning.scss";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const Meaning = ({ rotate1, rotate2, rotate3 }) => {
  const card1 = useSelector((state) => state.cards.card1);
  const card2 = useSelector((state) => state.cards.card2);
  const card3 = useSelector((state) => state.cards.card3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="meaning"
    >
      {card1 && (
        <div className="meaning-block">
          <span>{card1.name}</span>
          {rotate1 > 0 && <span>(reversed)</span>}
          <span>{rotate1 > 0 ? card1.meaning_rev : card1.meaning_up}</span>
        </div>
      )}
      {card2 && (
        <div className="meaning-block">
          <span>{card2.name}</span>
          {rotate2 > 0 && <span>(reversed)</span>}
          <span>{rotate2 > 0 ? card2.meaning_rev : card2.meaning_up}</span>
        </div>
      )}
      {card3 && (
        <div className="meaning-block">
          <span>{card3.name}</span>
          {rotate3 > 0 && <span>(reversed)</span>}
          <span>{rotate3 > 0 ? card3.meaning_rev : card3.meaning_up}</span>
        </div>
      )}
    </motion.div>
  );
};

export default Meaning;
