import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainmenu from "./components/mainmenu/mainmenu";
import Oraclepage from "./components/oraclepage/oraclepage";
import Options from "./components/options/options";
import OptionsButton from "./components/optionsbutton/optionsbutton.jsx";
import Manual from "./components/manual/manual.jsx";
import Loader from "./components/loader/loader.jsx";
import BackgroundMusic from "./components/music/music.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store.ts";
import "./App.scss";
import { setLoaderIsVisible, setOptionsVisibility } from "./redux/appSlice.ts";

function App() {
  const [parallaxStyle, setParallaxStyle] = useState({});
  const dispatch = useDispatch();


  const handleMouseMove = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    const xOffset = (window.innerWidth / 2 - clientX) / 50;
    const yOffset = (window.innerHeight / 2 - clientY) / 50;

    setParallaxStyle({
      transform: `translate(${xOffset}px, ${yOffset}px)`,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    dispatch(setLoaderIsVisible(true));
    dispatch(setOptionsVisibility(false))
  }, [dispatch]);

  const manualIsVisible = useSelector((state) => state.manual.manualIsVisible);
  const theme = useSelector((state) => state.theme.themeNumber);
  const loaderIsVisible = useSelector((state) => state.loader.loaderIsVisible);

  return (
    <BrowserRouter>
          <div className="App">
            {loaderIsVisible && <Loader />} 
            <div
              className={`parallax ${
                theme === 1 ? "black-theme" : "blue-theme"
              }`}
              style={parallaxStyle}
            />
            {manualIsVisible && <Manual />}
            <Options />
            <Routes>
              <Route path="/" element={<Mainmenu />} />
              <Route path="/oracle" element={<Oraclepage />} />
            </Routes>
            <OptionsButton />
            <BackgroundMusic />
          </div>
    </BrowserRouter>
  );
}

export default App;
