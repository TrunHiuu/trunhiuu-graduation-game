import { motion } from "framer-motion";
import React from "react";

interface PixelWindowProps {
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  x?: number;
  y?: number;
}

export default function PixelWindow({
  title,
  children,
  width = "400px",
  height = "300px",
  x = 0,
  y = 0,
}: PixelWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute bg-gradient-to-b from-blue-200 to-blue-300 border-4 border-gray-800 shadow-lg"
      style={{
        width,
        height,
        x,
        y,
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(255, 255, 255, 0.5)",
      }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-1 flex justify-between items-center border-b-2 border-gray-800">
        <span className="text-white font-bold text-xs" style={{ fontFamily: "Press Start 2P" }}>
          {title}
        </span>
        <button className="w-5 h-5 bg-gray-300 border-2 border-gray-800 text-gray-800 text-xs font-bold hover:bg-gray-400">
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-3 h-[calc(100%-28px)] overflow-auto">{children}</div>
    </motion.div>
  );
}
