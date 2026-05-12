import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TerminalWindowProps {
  commands?: string[];
}

export default function TerminalWindow({ commands }: TerminalWindowProps) {
  const defaultCommands = [
    "loading memories...",
    "compiling university life...",
    "fixing deadlines...",
    "survived.",
    "graduation complete.",
  ];

  const [displayText, setDisplayText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);

  useEffect(() => {
    const cmds = commands || defaultCommands;
    let charIndex = 0;
    const currentCmd = cmds[commandIndex];

    const interval = setInterval(() => {
      if (charIndex < currentCmd.length) {
        setDisplayText((prev) => prev + currentCmd[charIndex]);
        charIndex++;
      } else {
        clearInterval(interval);
        if (commandIndex < cmds.length - 1) {
          setTimeout(() => {
            setCommandIndex(commandIndex + 1);
            setDisplayText((prev) => prev + "\n");
          }, 500);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [commandIndex, commands]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bg-black border-4 border-green-600 shadow-lg"
      style={{
        width: "450px",
        height: "250px",
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(0, 255, 0, 0.1)",
      }}
    >
      {/* Title Bar */}
      <div className="bg-green-700 px-2 py-1 flex justify-between items-center border-b-2 border-green-600">
        <span className="text-green-300 font-bold text-xs" style={{ fontFamily: "monospace" }}>
          Terminal.exe
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-3 h-[calc(100%-28px)] overflow-auto bg-black font-mono text-green-300">
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
