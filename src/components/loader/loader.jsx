import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoaderIsVisible } from "../../redux/appSlice.ts";
import "./loader.scss";

const Loader = () => {
  const dispatch = useDispatch();
  const [fadeout, setFadeout] = useState(false);

  const handleButtonClick = () => {
    setFadeout(true);
    setTimeout(() => {
      dispatch(setLoaderIsVisible(false));
    }, 2000); 
  };

  return (
    <div className="loader" style={{
      opacity: fadeout ? 0 : 1
    }}>
      <button onClick={handleButtonClick}></button>
    </div>
  );
};

export default Loader;
