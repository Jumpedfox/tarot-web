import "./mainmenu.scss";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"; 
import { setNumberOfCards, setManualIsVisible } from "../../redux/appSlice.ts";

const Mainmenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const manualIsVisible = useSelector((state) => state.manual.manualIsVisible); 

  const handleNumberOfCardsChange = (number) => {
    dispatch(setNumberOfCards(number));
    navigate("/oracle");
  };

  const toggleManualVisibility = () => {
    dispatch(setManualIsVisible(!manualIsVisible)); 
  };

    return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 2 } }}
      >
        <div className="mainmenu">
          <div className="wrapper">
            <button className="menu-button menu-button-1" onClick={() => handleNumberOfCardsChange(1)}>
              <div className="onecardbutton1" />
            </button>
            <button className="menu-button menu-button-2" onClick={() => handleNumberOfCardsChange(3)}>
              <div className="onecardbutton3" />
            </button>
          </div>
          <div className="wrapper">
            <button className="menu-button menu-button-3" onClick={toggleManualVisibility}>
              <span> {manualIsVisible ? 'HidE' : 'ShoW'} ManuaL</span>
            </button>
            <button className="menu-button menu-button-4">
              <span>GallerY</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Mainmenu;
