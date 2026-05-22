import { motion } from "framer-motion";
import React from "react";
import { StudentStats } from "@/types/invite";

interface PlayerStatsProps {
  stats: StudentStats;
  title?: string;
  titleBarColor?: string;
  outerBg?: string;
  contentBg?: string;
  children?: React.ReactNode;
  hideScrollbar?: boolean;
}

export default function PlayerStatsWindow({
  stats,
  title = "DashBoard.exe",
  titleBarColor = "#FFA500",
  outerBg = "#D4C5B0",
  contentBg = "#D4C5B0",
  children,
  hideScrollbar = false,
}: PlayerStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full border-4 shadow-lg rounded-lg flex flex-col"
      style={{
        backgroundColor: outerBg,
        borderColor: "#808080",
        borderRadius: "6px",
        boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.5), -1px -1px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Title Bar */}
      <div
        className="px-2 py-1 border-b-2 flex-shrink-0 flex justify-between items-center"
        style={{
          background: titleBarColor,
          borderBottomColor: "#808080",
        }}
      >
        <span
          className="text-white font-bold text-xs flex items-center gap-1"
          style={{ fontFamily: "var(--font-roboto)" }}
        >
          {title}
        </span>
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

      <div 
        className={`p-4 flex-1 overflow-auto ${hideScrollbar ? "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : ""}`} 
        style={{ backgroundColor: contentBg }}
      >
        {/* Render any provided children (player UI) inside the framed content area. */}
        {children ?? <div style={{ minHeight: 80 }} />}
      </div>
    </motion.div>
  );
}
