import { motion } from "framer-motion";
import React from "react";
import { StudentStats } from "@/types/invite";

interface StudentStatsProps {
  stats: StudentStats;
  title?: string;
  titleBarColor?: string;
}

export default function StudentStatsWindow({
  stats,
  title = "DashBoard.exe",
  titleBarColor = "#FFA500",
}: StudentStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full border-4 shadow-lg rounded-lg flex flex-col"
      style={{
        backgroundColor: "#D4C5B0",
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

      {/* Content */}
      <div className="p-4 flex-1 overflow-auto" style={{ backgroundColor: "#D4C5B0" }}>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold" style={{ fontFamily: "var(--font-roboto)" }}>
              LEVEL: {stats.level}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold" style={{ fontFamily: "var(--font-roboto)" }}>
              GRADUATION YEAR
            </p>
            <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs mt-1">{stats.graduation_year}</p>
          </div>

          <div>
            <p className="text-xs font-bold" style={{ fontFamily: "var(--font-roboto)" }}>
              SLEEP
            </p>
            <div className="w-full bg-gray-400 border-2 border-gray-800 h-4 mt-1 relative">
              <div
                className="bg-red-500 h-full"
                style={{ width: "15%" }}
              ></div>
            </div>
            <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs text-right mt-1">{stats.sleep}</p>
          </div>

          <div>
            <p className="text-xs font-bold" style={{ fontFamily: "var(--font-roboto)" }}>
              BUGS FIXED
            </p>
            <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs mt-1">{stats.bugFixed}</p>
          </div>

          <div>
            <p className="text-xs font-bold" style={{ fontFamily: "var(--font-roboto)" }}>
              SIDE QUESTS
            </p>
            <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs mt-1">{stats.sideQuests}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
