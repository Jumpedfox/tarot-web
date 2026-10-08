import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Flex } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";

import Mainmenu from "./components/mainmenu/index.jsx";
import Oraclepage from "./components/oraclepage/index.jsx";
import Options from "./components/options/index.jsx";
import OptionsButton from "./components/optionsbutton/index.jsx";
import Loader from "./components/loader/index.jsx";
import BackgroundMusic from "./components/music/index.jsx";
import Gallery from "./components/gallery/index.jsx";
import Manual from "./components/manual/index.jsx";
import CosmicBackground from "./components/cosmos/CosmicBackground.jsx";

function App() {
  const manualIsVisible = useSelector((state) => state.ui.manualIsVisible);
  const loaderIsVisible = useSelector((state) => state.ui.loaderIsVisible);
  const optionsAreVisible = useSelector((state) => state.ui.optionsAreVisible);
  const theme = useSelector((state) => state.theme.themeName);
  const themeFilter =
    theme === "bright" ? "brightness(1.3)" : "brightness(0.5)";

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <CosmicBackground filter={themeFilter} />
      <Flex
        textAlign="center"
        w="full"
        h="100dvh"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="end"
        userSelect="none"
        overflow="hidden"
        zIndex={1}
        transition="3s"
        filter={themeFilter}
      >
        {loaderIsVisible && <Loader />}
        <AnimatePresence>
          {manualIsVisible && <Manual />}
          {optionsAreVisible && <Options />}
        </AnimatePresence>

        <Routes>
          <Route path="/" element={<Mainmenu />} />
          <Route path="/oracle" element={<Oraclepage />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>

        <OptionsButton />
        <BackgroundMusic />
      </Flex>
    </BrowserRouter>
  );
}

export default App;
