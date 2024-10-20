"use client";

export default function Mascot() {
  return (
    <div className="text-center">
      <img
        src="/oski.jpg"
        alt="Oski the Bear"
        className="w-48 h-48 mx-auto mb-4 rounded-full border-4 border-yellow-400 transition-transform duration-500 hover:animate-flip"
      />
    </div>
  );
}
