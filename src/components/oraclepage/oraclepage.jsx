import { useDispatch, useSelector } from "react-redux";
import "./oraclepage.scss";
import { AnimatePresence, motion } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import {
  setCard1,
  setCard2,
  setCard3,
  setMeaningVisiblility,
} from "../../redux/appSlice.ts";
import { useEffect, useState } from "react";
import Card from "../card/card.jsx";
import { useNavigate } from "react-router-dom";
import Meaning from "../meaning/meaning.jsx";

const Oraclepage = () => {
  const numberOfCards = useSelector((state) => state.cards.numberOfCards);
  const optionsAreVisible = useSelector(
    (state) => state.options.optionsAreVisible
  );
  const meaningIsVisible = useSelector((state) => state.cards.meaningIsVisible);
  const onlyMajorArcana = useSelector((state) => state.cards.onlyMajorArcana);

  const navigate = useNavigate();

  const card1 = useSelector((state) => state.cards.card1);
  const card2 = useSelector((state) => state.cards.card2);
  const card3 = useSelector((state) => state.cards.card3);

  const [twist1, setTwist1] = useState(0);
  const [twist2, setTwist2] = useState(0);
  const [twist3, setTwist3] = useState(0);

  const [rotate1, setRotate1] = useState(0);
  const [rotate2, setRotate2] = useState(0);
  const [rotate3, setRotate3] = useState(0);

  const [activeCard, setActiveCard] = useState(null);

  const firebaseConfig = {
    databaseURL:
      "https://tarot-api-708a1-default-rtdb.europe-west1.firebasedatabase.app/",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dispatch = useDispatch();

  const getValue = async (number, cardIndex) => {
    const dbRef = ref(database, `/cards/${number}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const cardData = snapshot.val();
        switch (cardIndex) {
          case 1:
            dispatch(setCard1(cardData));
            break;
          case 2:
            dispatch(setCard2(cardData));
            break;
          case 3:
            dispatch(setCard3(cardData));
            break;
          default:
            console.log("Invalid card index");
        }
      } else {
        console.log(`No data available for card ${cardIndex}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getCards = async () => {
    const getRandomNumber = () => {
      let number;
      do {
        if (onlyMajorArcana) {
          number = Math.floor(Math.random() * 22);
        } else {
          number = Math.floor(Math.random() * 78);
        }
      } while (usedNumbers.includes(number));
      return number;
    };

    const getRandomCardTwist = () => {
      const range1Min = -7;
      const range1Max = -2;
      const range2Min = 2;
      const range2Max = 7;
      const randomNumber = Math.random();

      if (randomNumber < 0.5) {
        return (
          Math.floor(Math.random() * (range1Max - range1Min + 1)) + range1Min
        );
      } else {
        return (
          Math.floor(Math.random() * (range2Max - range2Min + 1)) + range2Min
        );
      }
    };

    const usedNumbers = [];

    if (numberOfCards === 1) {
      const number = getRandomNumber(usedNumbers);
      usedNumbers.push(number);
      await getValue(number, 1);
      setTwist1(getRandomCardTwist());
      setRotate1(isCardReversed() ? 180 : 0);
    } else if (numberOfCards === 3) {
      let number = getRandomNumber(usedNumbers);
      usedNumbers.push(number);
      await getValue(number, 1);
      setTwist1(getRandomCardTwist());
      setRotate1(isCardReversed() ? 180 : 0);
      await delay(2000);

      number = getRandomNumber(usedNumbers);
      usedNumbers.push(number);
      await getValue(number, 2);
      setTwist2(getRandomCardTwist());
      setRotate2(isCardReversed() ? 180 : 0);
      await delay(2000);

      number = getRandomNumber(usedNumbers);
      usedNumbers.push(number);
      await getValue(number, 3);
      setTwist3(getRandomCardTwist());
      setRotate3(isCardReversed() ? 180 : 0);
    }
  };

  const resetCards = () => {
    card1 && dispatch(setCard1(null));
    card2 && dispatch(setCard2(null));
    card3 && dispatch(setCard3(null));
    setTwist1(0);
    setTwist2(0);
    setTwist3(0);
    setRotate1(0);
    setRotate2(0);
    setRotate3(0);
    setActiveCard(null);
    dispatch(setMeaningVisiblility(false));
  };

  const handleCardClick = (cardNumber) => {
    setActiveCard(cardNumber);
  };

  const isCardReversed = () => {
    return Math.random() < 0.5;
  };

  useEffect(() => {
    return () => {
      resetCards();
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3 }}
      >
        <div
          className="oraclepage"
          style={{
            opacity: optionsAreVisible ? 0 : 1,
            transition: optionsAreVisible ? "1s" : "7s",
          }}
        >
          <>
            {meaningIsVisible && card1 ? (
              <Meaning rotate1={rotate1} rotate2={rotate2} rotate3={rotate3} />
            ) : (
              <>
                {card1 && (
                  <Card
                    card={card1}
                    cardNumber={1}
                    twist={twist1}
                    isActive={activeCard === 1}
                    rotation={rotate1}
                    onClick={() => handleCardClick(1)}
                  />
                )}
                {card2 && (
                  <Card
                    card={card2}
                    cardNumber={2}
                    twist={twist2}
                    isActive={activeCard === 2}
                    rotation={rotate2}
                    onClick={() => handleCardClick(2)}
                  />
                )}
                {card3 && (
                  <Card
                    card={card3}
                    cardNumber={3}
                    twist={twist3}
                    isActive={activeCard === 3}
                    rotation={rotate3}
                    onClick={() => handleCardClick(3)}
                  />
                )}
              </>
            )}
          </>

          <div className="buttons-wrapper">
            <button onClick={() => navigate("/")}>
              <span>BacK</span>
            </button>
            <button
              onClick={() => getCards(numberOfCards)}
              disabled={card1 ? true : false}
            >
              <span>See YouR FortunE</span>
            </button>
            <button
              onClick={() => dispatch(setMeaningVisiblility(!meaningIsVisible))}
              disabled={
                numberOfCards === 1 && !card1
                  ? true
                  : numberOfCards === 3 && !card3
                  ? true
                  : false
              }
            >
              <span>{meaningIsVisible ? "Hide" : "Show"} MeaninG</span>
            </button>
            <button
              onClick={() => resetCards()}
              disabled={meaningIsVisible || !card1}
            >
              <span>ReseT</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Oraclepage;
