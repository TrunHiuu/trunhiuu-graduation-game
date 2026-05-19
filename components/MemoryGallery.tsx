import { motion } from "framer-motion";
import React from "react";

interface MemoryGalleryProps {
  memories: Array<{ id: string; image_url: string; caption: string }>;
}

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!memories || memories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full bg-gradient-to-b from-pink-200 to-pink-300 border-4 border-gray-800 shadow-lg flex flex-col"
        style={{
          boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-2 py-1 border-b-2 border-gray-800 flex-shrink-0">
          <span className="text-white font-bold text-xs" style={{ fontFamily: "var(--font-roboto)" }}>
            Memories.exe
          </span>
        </div>
        <div className="p-4 flex-1 flex items-center justify-center">
          <p className="text-center text-sm">No memories yet...</p>
        </div>
      </motion.div>
    );
  }

  const current = memories[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full bg-gradient-to-b from-pink-200 to-pink-300 border-4 border-gray-800 shadow-lg flex flex-col"
      style={{
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(255, 255, 255, 0.5)",
      }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-2 py-1 border-b-2 border-gray-800 flex-shrink-0">
        <span className="text-white font-bold text-xs" style={{ fontFamily: "var(--font-roboto)" }}>
          Memories.exe
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Image */}
        <div className="flex-1 bg-black border-2 border-gray-800 mb-2 overflow-hidden flex items-center justify-center">
          <motion.img
            key={current.id}
            src={current.image_url}
            alt={current.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Caption */}
        <p className="text-xs mb-2 text-center">{current.caption}</p>

        {/* Navigation */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCurrentIndex((i) => (i - 1 + memories.length) % memories.length)}
            className="px-2 py-1 bg-gray-300 border-2 border-gray-800 text-xs font-bold hover:bg-gray-400"
          >
            {"<"}
          </button>
          <span className="text-xs self-center">
            {currentIndex + 1} / {memories.length}
          </span>
          <button
            onClick={() => setCurrentIndex((i) => (i + 1) % memories.length)}
            className="px-2 py-1 bg-gray-300 border-2 border-gray-800 text-xs font-bold hover:bg-gray-400"
          >
            {">"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
