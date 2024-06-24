import { setOptionsVisibility } from "../../redux/appSlice.ts";
import "./optionsbutton.scss";
import { useDispatch, useSelector } from "react-redux";

const OptionsButton = () => {
  const dispatch = useDispatch();

  const optionsAreVisible = useSelector(
    (state) => state.options.optionsAreVisible
  );
  const theme = useSelector((state) => state.theme.themeNumber);

  return (
    <button
      className="optionsbutton"
      style={{
        width: optionsAreVisible && "500px",
        height: optionsAreVisible && "500px",
        opacity: optionsAreVisible ? 0 : 1,
        transition: optionsAreVisible ? "1.5s" : "4s",
        filter: theme === 2 && "hue-rotate(320deg) brightness(2)",
      }}
      onClick={() => dispatch(setOptionsVisibility(true))}
    ></button>
  );
};

export default OptionsButton;
