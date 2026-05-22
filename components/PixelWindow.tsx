import { motion } from "framer-motion";
import React from "react";

interface PixelWindowProps {
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  x?: number;
  y?: number;
  titleBarColor?: string;
  contentBg?: string;
}

export default function PixelWindow({
  title,
  children,
  width = "400px",
  height = "300px",
  x = 0,
  y = 0,
  titleBarColor = "#0066CC",
  contentBg = "#D4C5B0",
}: PixelWindowProps) {
  const isAbsolute = x !== 0 || y !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`border-4 shadow-lg rounded-lg ${
        isAbsolute ? "absolute" : "relative w-full h-full flex flex-col"
      }`}
      style={{
        backgroundColor: "#D4C5B0",
        borderColor: "#808080",
        borderRadius: "6px",
        ...(isAbsolute
          ? {
              width,
              height,
              x,
              y,
              boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.5), -1px -1px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.3)",
            }
          : {
              width: "100%",
              height: "100%",
              boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.5), -1px -1px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.3)",
            }),
      }}
    >
      {/* Title Bar */}
      <div
        className="px-2 py-1 flex justify-between items-center border-b-2 flex-shrink-0"
        style={{
          background: titleBarColor,
          borderBottomColor: "#808080",
          display: "flex",
        }}
      >
        <span
          className="text-white font-bold text-xs flex items-center gap-1"
          style={{ fontFamily: "var(--font-roboto)" }}
        >
          {title}
        </span>
        <div className="flex gap-1">
          <button
            className="w-5 h-5 text-gray-800 text-xs font-bold border-2"
            style={{
              backgroundColor: "#C0C0C0",
              borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
            }}
          >
            _
          </button>
          <button
            className="w-5 h-5 text-gray-800 text-xs font-bold border-2"
            style={{
              backgroundColor: "#C0C0C0",
              borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
            }}
          >
            □
          </button>
          <button
            className="w-5 h-5 text-gray-800 text-xs font-bold border-2"
            style={{
              backgroundColor: "#C0C0C0",
              borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-auto" style={{ backgroundColor: contentBg }}>
        {children}
      </div>
    </motion.div>
  );
}
