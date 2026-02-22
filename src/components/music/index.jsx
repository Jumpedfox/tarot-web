import ReactHowler from "react-howler";
import { useSelector } from "react-redux";

const BackgroundMusic = () => {
  const musicVolume = useSelector((state) => state.sound.volume);
  const musicIsMuted = useSelector((state) => state.sound.muted);

  return (
    <ReactHowler
      src="https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/Soundtrack.mp3"
      playing={!musicIsMuted}
      loop
      volume={musicVolume}
    />
  );
};

export default BackgroundMusic;
