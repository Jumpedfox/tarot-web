import "./manual.scss";
import { motion } from "framer-motion";

const Manual = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="manual"
    >
      <span>
        To begin your divination, select the number of cards, then on the next
        page, press "see your fortune".
      </span>
      <span>Optionally, adjust to use only the Major Arcana in the menu. </span>
      <span>To open the menu, simply tap the galaxy icon.</span>
      <span>
        You can also adjust the music volume, mute it, or change the background
        theme to light or dark as desired.
      </span>
      <span>The Gallery page is still in progress.</span>
    </motion.div>
  );
};

export default Manual;
