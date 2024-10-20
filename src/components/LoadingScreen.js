import { useEffect, useState, useRef } from "react";

const LoadingScreen = ({ exitLoadingScreen }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/menu_audio.wav");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // Play audio when the user clicks anywhere on the screen
    const playAudioOnClick = () => {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback was prevented:", error);
        setIsMuted(true);
      });
    };

    // Add a click event listener to play audio
    window.addEventListener("click", playAudioOnClick);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("click", playAudioOnClick);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleEnterOracle = () => {
    if (audioRef.current) {
      // Stop the audio when "Enter Oracle" is clicked
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    exitLoadingScreen(); // Call to exit the loading screen
  };

  return (
    <div className="loading-screen">
      <div className="oski-sprite mb-8"></div>
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">
        Loading Oski Oracle
      </h2>
      <button
        onClick={handleEnterOracle}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Enter Oracle
      </button>

      {/* Music toggle button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 left-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 transition duration-300 focus:outline-none"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default LoadingScreen;
