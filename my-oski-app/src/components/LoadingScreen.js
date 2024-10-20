import { useState, useEffect, useRef } from "react";

const LoadingScreen = ({ exitLoadingScreen, audioRef, toggleMute, isMuted }) => {
  return (
    <div className="loading-screen">
      <div className="oski-sprite mb-8"></div>
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">
        Loading Oski Oracle
      </h2>
      <button
        onClick={exitLoadingScreen}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Enter Oracle
      </button>

      <button
        onClick={toggleMute}
        className="absolute bottom-4 left-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 transition duration-300 focus:outline-none"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🎵"}
      </button>
    </div>
  );
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/menu_audio.wav");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  const startLoadingScreen = () => {
    setIsLoading(true);
    audioRef.current.play().catch((error) => {
      console.error("Audio playback was prevented:", error);
    });
    setTimeout(() => setHasStarted(true), 2000); // Simulates loading time
  };

  const exitLoadingScreen = () => {
    setIsLoading(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <>
      {!hasStarted && !isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <button
            onClick={startLoadingScreen}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded text-2xl transition duration-300"
          >
            Talk to Oski
          </button>
        </div>
      ) : isLoading ? (
        <LoadingScreen 
          exitLoadingScreen={exitLoadingScreen} 
          audioRef={audioRef}
          toggleMute={toggleMute}
          isMuted={isMuted}
        />
      ) : (
        // Main app content goes here after loading screen
        <div className="main-app">
          {/* Main content */}
        </div>
      )}
    </>
  );
};

export default Home;
