"use client";

export default function Mascot() {
  return (
    <div className="text-center">
      <img
        src="/oski.jpg"
        alt="Oski the Bear"
        className="w-48 h-auto mx-auto mb-4 animate-pulse transition-transform duration-500 hover:scale-110"
      />
    </div>
  );
}