import { useRef } from "react";
import ReactHowler from "react-howler";
import { useSelector } from "react-redux";

const BackgroundMusic = () => {
  const musicVolume = useSelector((state) => state.sound.volume);
  const musicIsMuted = useSelector((state) => state.sound.muted);
  const playerRef = useRef(null);
  const mutedRef = useRef(musicIsMuted);
  mutedRef.current = musicIsMuted;

  // Browsers block sound until the user interacts with the page. When the
  // first play is refused, retry on the first interaction (the click on the
  // eye in the loader), which unlocks audio.
  const handlePlayError = () => {
    const howl = playerRef.current?.howler;
    howl?.once("unlock", () => {
      if (!mutedRef.current && !howl.playing()) howl.play();
    });
  };

  return (
    <ReactHowler
      ref={playerRef}
      src="https://pub-1f93d9e198104bc5996a475ce6959416.r2.dev/Soundtrack.mp3"
      playing={!musicIsMuted}
      loop
      volume={musicVolume}
      html5={true}
      onPlayError={handlePlayError}
    />
  );
};

export default BackgroundMusic;
