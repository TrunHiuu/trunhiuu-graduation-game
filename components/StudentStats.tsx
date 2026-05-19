import { motion } from "framer-motion";
import React from "react";
import { StudentStats } from "@/types/invite";

interface StudentStatsProps {
  stats: StudentStats;
}

export default function StudentStatsWindow({ stats }: StudentStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full bg-gradient-to-b from-purple-200 to-purple-300 border-4 border-gray-800 shadow-lg flex flex-col"
      style={{
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(255, 255, 255, 0.5)",
      }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-2 py-1 border-b-2 border-gray-800 flex-shrink-0">
        <span className="text-white font-bold text-xs" style={{ fontFamily: "var(--font-roboto)" }}>
          StudentStats.exe
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-auto">
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
