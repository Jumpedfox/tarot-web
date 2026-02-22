import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";

import Mainmenu from "./components/mainmenu/index.jsx";
import Oraclepage from "./components/oraclepage/index.jsx";
import Options from "./components/options/index.jsx";
import OptionsButton from "./components/optionsbutton/index.jsx";
import Loader from "./components/loader/index.jsx";
import BackgroundMusic from "./components/music/index.jsx";
import bgPic from "./images/bg2.jpg";
import bgPic2 from "./images/stars.png";
import bgPic3 from "./images/stars2.png";
import Gallery from "./components/gallery/index.jsx";
import Manual from "./components/manual/index.jsx";

function App() {
  const manualIsVisible = useSelector((state) => state.ui.manualIsVisible);
  const loaderIsVisible = useSelector((state) => state.ui.loaderIsVisible);
  const optionsAreVisible = useSelector((state) => state.ui.optionsAreVisible);
  const theme = useSelector((state) => state.theme.themeName);
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const [parallax, setParallax] = useState({
    back: {},
    mid: {},
    front: {},
  });

  useEffect(() => {
    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const dx = window.innerWidth / 2 - e.clientX;
        const dy = window.innerHeight / 2 - e.clientY;

        setParallax({
          sm: {
            transform: `translate(${dx / 150}px, ${dy / 150}px)`,
          },
          md: {
            transform: `translate(${dx / 50}px, ${dy / 50}px)`,
          },
          lg: {
            transform: `translate(${dx / 15}px, ${dy / 15}px)`,
          },
        });

        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <BrowserRouter>
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
        bgImage={`url(${bgPic})`}
        bgSize="cover"
        bgPos="center"
        transition="3s"
        filter={theme === "bright" ? "brightness(1.3)" : "brightness(0.5)"}
      >
        {loaderIsVisible && <Loader />}
        {isDesktop && (
          <>
            <Box
              position="absolute"
              zIndex={-2}
              w="200%"
              h="200%"
              bgImage={`url(${bgPic2})`}
              bgRepeat="no-repeat"
              bgSize="contain"
              bgPos="center"
              pointerEvents="none"
              style={parallax.lg}
            />
            <Box
              position="absolute"
              zIndex={-1}
              w="120%"
              h="120%"
              bgImage={`url(${bgPic3})`}
              bgRepeat="no-repeat"
              bgSize="contain"
              bgPos="center"
              pointerEvents="none"
              style={parallax.md}
            />

            <Box
              position="absolute"
              zIndex={-1}
              w="100%"
              h="100%"
              bgImage={`url(${bgPic2})`}
              bgRepeat="no-repeat"
              bgSize="contain"
              bgPos="center"
              pointerEvents="none"
              style={parallax.sm}
            />
          </>
        )}
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
