"use client";

export default function ResponseDisplay({ response }) {
  return (
    <div className="speech-bubble p-4 bg-gray-700 rounded-lg text-left mb-4">
      <p id="oski-response" className="text-white">
        {response ? response : "Hi! Ask me what's happening on campus!"}
      </p>
    </div>
  );
}
