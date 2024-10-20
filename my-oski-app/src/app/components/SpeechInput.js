"use client";

import { useState } from "react";
import axios from "axios";

export default function SpeechInput({ onResponse }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const toggleListening = () => {
    if (!recognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.lang = "en-US";

      recog.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        try {
          const res = await axios.post("/api/transcribe", {
            type: "audio",
            audioData: transcript,
          });
          onResponse(res.data);
        } catch (error) {
          console.error("Error processing audio input:", error);
        }
      };

      setRecognition(recog);
    }

    // Toggle listening
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }

    setIsListening(!isListening);
  };

  return (
    <button
      className="mic-button p-2 bg-yellow-500 text-white rounded-full ml-4 text-2xl hover:scale-110 hover:shadow-lg"
      onClick={toggleListening}
    >
      {isListening ? "🔇" : "🎤"}
    </button>
  );
}
