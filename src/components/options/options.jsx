import "./options.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  setMuted,
  setOnlyMajorArcana,
  setOptionsVisibility,
  setThemeNumber,
  setVolume,
} from "../../redux/appSlice.ts";

const Options = () => {
  const dispatch = useDispatch();

  const musicVolume = useSelector((state) => state.sound.volume);
  const musicIsMuted = useSelector((state) => state.sound.muted);
  const onlyMajorArcana = useSelector((state) => state.cards.onlyMajorArcana);
  const themeNumber = useSelector((state) => state.theme.themeNumber);

  const optionsAreVisible = useSelector(
    (state) => state.options.optionsAreVisible
  );

  const handleVolumeChange = (volume) => {
    dispatch(setVolume(volume));
  };

  return (
    <AnimatePresence>
      {optionsAreVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 2 } }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="options"
          style={{
            bottom: optionsAreVisible ? "24%" : "-20%",
            width: optionsAreVisible ? "1300px" : "500px",
            height: optionsAreVisible ? "1300px" : "500px",
            opacity: optionsAreVisible ? "1" : "0",
          }}
        >
          <motion.div
            className="options-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 5 }}
          >
            <button
              className={!musicIsMuted ? "active-button" : ""}
              onClick={() => dispatch(setMuted(!musicIsMuted))}
            >
              <span>
                MusiC <br />
                {musicIsMuted ? "Off" : "On"}
              </span>
            </button>
            <button
              className={onlyMajorArcana ? "active-button" : ""}
              onClick={() => dispatch(setOnlyMajorArcana(!onlyMajorArcana))}
            >
              <span>Only Major arcanA</span>
            </button>
            <div className="volume-buttons">
              <span>VolumE</span>
              <div>
                <button
                  className={musicVolume === 0.2 ? "active-button" : ""}
                  onClick={() => handleVolumeChange(0.2)}
                >
                  <span>1</span>
                </button>
                <button
                  className={musicVolume === 0.4 ? "active-button" : ""}
                  onClick={() => handleVolumeChange(0.4)}
                >
                  <span>2</span>
                </button>
                <button
                  className={musicVolume === 0.6 ? "active-button" : ""}
                  onClick={() => handleVolumeChange(0.6)}
                >
                  <span>3</span>
                </button>
                <button
                  className={musicVolume === 0.8 ? "active-button" : ""}
                  onClick={() => handleVolumeChange(0.8)}
                >
                  <span>4</span>
                </button>
                <button
                  className={musicVolume === 1 ? "active-button" : ""}
                  onClick={() => handleVolumeChange(1)}
                >
                  <span>5</span>
                </button>
              </div>
            </div>
            <button
              onClick={() =>
                dispatch(setThemeNumber(themeNumber === 1 ? 2 : 1))
              }
              className={themeNumber === 2 ? "active-button" : ""}

            >
              <span>ThemE</span>
            </button>
            <button onClick={() => dispatch(setOptionsVisibility(false))}>
              <span>ClosE MenU</span>
            </button>
          </motion.div>
          <motion.div
            className="options-icons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          >
            <div className="icon icon1" />
            <div className="icon icon2" />
            <div className="icon icon3" />
            <div className="icon icon4" />
            <div className="icon icon5" />
            <div className="icon icon6" />
            <div className="icon icon7" />
            <div className="icon icon8" />
            <div className="icon icon9" />
            <div className="icon icon10" />
            <div className="icon icon11" />
            <div className="icon icon12" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Options;
