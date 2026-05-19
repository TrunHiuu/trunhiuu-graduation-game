import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TerminalWindowProps {
  commands?: string[];
}

const defaultCommands = [
  "loading memories...",
  "compiling university life...",
  "fixing deadlines...",
  "survived.",
  "graduation complete.",
];

export default function TerminalWindow({ commands }: TerminalWindowProps) {
  const [displayText, setDisplayText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);

  useEffect(() => {
    const cmds = commands || defaultCommands;
    
    // Ngừng nếu đã hoàn thành tất cả commands
    if (commandIndex >= cmds.length) {
      return;
    }

    let charIndex = 0;
    const currentCmd = cmds[commandIndex];
    let interval: NodeJS.Timeout | undefined;
    let timeout: NodeJS.Timeout | undefined;

    const startTyping = () => {
      interval = setInterval(() => {
        if (charIndex < currentCmd.length) {
          setDisplayText((prev) => prev + currentCmd[charIndex]);
          charIndex++;
        } else {
          if (interval) clearInterval(interval);
          if (commandIndex < cmds.length - 1) {
            timeout = setTimeout(() => {
              setCommandIndex((prev) => prev + 1);
              setDisplayText((prev) => prev + "\n");
            }, 500);
          }
        }
      }, 50);
    };

    startTyping();

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [commandIndex, commands]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full bg-black border-4 border-green-600 shadow-lg flex flex-col"
      style={{
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(0, 255, 0, 0.1)",
      }}
    >
      {/* Title Bar */}
      <div className="bg-green-700 px-2 py-1 flex justify-between items-center border-b-2 border-green-600 flex-shrink-0">
        <span className="text-green-300 font-bold text-xs" style={{ fontFamily: "monospace" }}>
          Terminal.exe
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-3 flex-1 overflow-auto bg-black font-mono text-green-300">
        <div className="text-xs whitespace-pre-wrap break-words">{displayText}</div>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-green-400"
        >
          _
        </motion.span>
      </div>
    </motion.div>
  );
}
