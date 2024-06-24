import React from "react";
import ReactHowler from "react-howler";
import { useSelector } from "react-redux";

const BackgroundMusic = () => {
  const musicVolume = useSelector((state) => state.sound.volume);
  const musicIsMuted = useSelector((state) => state.sound.muted);

  return (
    <ReactHowler
      src="https://firebasestorage.googleapis.com/v0/b/tarot-api-708a1.appspot.com/o/backgroundMusic.mp3?alt=media&token=b55292ca-7f04-4a3f-ade6-6d0425df7d6f"
      playing={!musicIsMuted}
      loop
      volume={musicVolume}
    />
  );
};

export default BackgroundMusic;
