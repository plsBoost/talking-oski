"use client";

import Mascot from "./components/Mascot";
import { useState, useEffect, useRef } from "react";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

export default function Home() {
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const oskiResponseRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "en-US";

      recog.onstart = function () {
        if (oskiResponseRef.current) {
          oskiResponseRef.current.innerText = "Listening...";
        }
      };

      recog.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        handleGPTResponse(transcript);
      };

      recog.onerror = function (event) {
        if (oskiResponseRef.current) {
          oskiResponseRef.current.innerText = "Error: " + event.error;
        }
      };

      setRecognition(recog);
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    } else {
      console.error("Recognition object is not initialized yet.");
    }
  };

  const handleGPTResponse = async (inputText) => {
    try {
      setIsFetchingResponse(true);
      setResponse((prevResponse) => prevResponse + "\n\nOski: ");

      // 1. Request GPT response
      const gptResponse = await axios.post("/api/gpt", { message: inputText });
      const textResponse = gptResponse.data.response;

      // Set the GPT text response
      setResponse((prevResponse) => prevResponse + textResponse);

      // 2. Now request the TTS audio from ttsHandler using GPT response
      const ttsResponse = await axios.post(
        "/api/tts",
        { text: textResponse },
        { responseType: "blob" }
      );
      const blob = new Blob([ttsResponse.data], { type: "audio/wav" });
      const newAudioUrl = URL.createObjectURL(blob);

      // Set the new audio URL and play the audio
      setAudioUrl(newAudioUrl);
      const audio = new Audio(newAudioUrl);
      audio.play();

      setIsFetchingResponse(false);
    } catch (error) {
      console.error("Error fetching GPT or TTS response:", error);
      setResponse(
        (prevResponse) => prevResponse + "\n\nError: Could not fetch response."
      );
      setIsFetchingResponse(false);
    }
  };

  const handleEnterKey = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const userInput = e.target.value;
      setResponse((prevResponse) => prevResponse + "\nYou: " + userInput);
      handleGPTResponse(userInput);
      e.target.value = ""; // Clear the input field after submitting
    }
  };

  const exitLoadingScreen = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen exitLoadingScreen={exitLoadingScreen} />
      ) : (
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/doe.jpg')" }}
        >
          <div className="bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-12">
            <h1 className="text-4xl font-extrabold mb-6 text-yellow-400">
              The Oski Oracle
            </h1>
            <Mascot />
            <div className="speech-bubble p-4 bg-gray-700 rounded-lg text-left mb-4 hover:shadow-lg">
              <ReactMarkdown
                className="text-white"
                remarkPlugins={[remarkBreaks]}
                ref={oskiResponseRef}
              >
                {response ? response : "Hi! Ask me what's happening on campus!"}
              </ReactMarkdown>
            </div>
            <div className="flex justify-center items-center">
              <input
                type="text"
                id="user-input"
                placeholder="Type your question here..."
                className="w-full h-24 p-4 bg-gray-900 border-2 border-yellow-400 text-white rounded mb-4 overflow-y-auto"
                onKeyDown={handleEnterKey}
              />
              <button
                className="mic-button p-2 bg-yellow-500 text-white rounded-full ml-4 text-2xl hover:scale-110 hover:shadow-lg"
                id="mic-btn"
                onClick={toggleListening}
              >
                {isListening ? "🔇" : "🎤"}
              </button>
            </div>
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full mt-4"
              />
            )}
            <div className="mt-4">
              {isFetchingResponse && (
                <p className="text-gray-400">Waiting for Oski's response...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
