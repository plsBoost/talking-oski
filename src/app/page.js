"use client";

import Mascot from "./components/Mascot";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to toggle the microphone listening state
  const toggleListening = () => {
    console.log("Mic button clicked. Is listening:", isListening);

    if (!recognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.lang = "en-US";

      recog.onstart = function () {
        console.log("Listening started...");
        document.getElementById("oski-response").innerText = "Listening...";
      };

      recog.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript received:", transcript);
        document.getElementById("user-input").value = transcript;
        handleResponse(transcript);
      };

      recog.onerror = function (event) {
        console.error("Error during speech recognition:", event.error);
        document.getElementById("oski-response").innerText =
          "Error: " + event.error;
      };

      setRecognition(recog);
    }

    if (isListening) {
      recognition.stop();
      console.log("Stopped listening.");
    } else {
      recognition.start();
      console.log("Started listening.");
    }

    setIsListening(!isListening);
  };

  // Function to handle appending the transcribed words
  const handleResponse = (transcript) => {
    console.log("Transcript being handled:", transcript);
    // Append the new transcript to the existing response
    setResponse((prevResponse) => prevResponse + " " + transcript);
  };

  // Function to handle Enter key press
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleResponse(e.target.value);
      e.target.value = ''; // Clear the input field after submitting
    }
  };

  // Function to exit the loading screen
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
            <div className="text-center">
              <img
                src="/oski.jpg"
                alt="Oski the Bear"
                className="w-48 h-48 mx-auto mb-4 rounded-full border-4 border-yellow-400 hover:animate-bounce"
              />
            </div>
            <div className="speech-bubble p-4 bg-gray-700 rounded-lg text-left mb-4 hover:shadow-lg">
              <p id="oski-response" className="text-white">
                {response ? response : "Hi! Ask me what's happening on campus!"}
              </p>
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
            <div className="mt-4">
              <p className="text-gray-400">Waiting for Oski’s response...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
