import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface NotificationWindowProps {
  commands?: string[];
  title?: string;
  titleBarColor?: string;
}

const defaultCommands = [
  "Hi there, my adorable friends!",
  "You are officially invited to join my Graduation Game — the final stage of my university journey.",
  " ",
  "Complete each mission to unlock special memories and reward",
  "Reward will be redeemed at my Graduation Ceremony!",
  " ", 
  "Let’s celebrate this unforgettable ending together, cheer for one another, and create one last beautiful memory before the game officially ends.",
  " ",
  "     ---------------------------------------------------------------",
  "     Mission Information       ",
  "1st Round - Quiz Challenge:                  Opening",
  "2nd Round - Quiz Challenge:                  Opening",
  "3rd Round - Wish Crafting Odyssey:        Opening",
  "4th Round - Photographic Finale:           Coming soon (9/6/2026)",
  " ",
  "     ---------------------------------------------------------------",
  "To begin your mission, please CONFIRM your attendance in the Mission.exe window!",
];

export default function NotificationWindow({
  commands,
  title = "Notification.exe",
  titleBarColor = "#00CC00",
}: NotificationWindowProps) {
  const [displayText, setDisplayText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);

  const handleDisplayText = (text: string) => {
    setDisplayText(text);
  };

  useEffect(() => {
    const cmds = commands || defaultCommands;
    
    if (commandIndex >= cmds.length) {
      return;
    }

    let fullText = "";
    for (let i = 0; i < commandIndex; i++) {
      fullText += cmds[i] + "\n";
    }

    let charIndex = 0;
    const currentCmd = cmds[commandIndex];
    let interval: NodeJS.Timeout | undefined;
    let timeout: NodeJS.Timeout | undefined;

    const startTyping = () => {
      interval = setInterval(() => {
        if (charIndex < currentCmd.length) {
          fullText += currentCmd[charIndex];
          handleDisplayText(fullText);
          charIndex++;
        } else {
          if (interval) clearInterval(interval);
          if (commandIndex < cmds.length - 1) {
            timeout = setTimeout(() => {
              setCommandIndex((prev) => prev + 1);
            }, 300);
          }
        }
      }, 25);
    };

    startTyping();

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [commandIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full border-4 shadow-lg rounded-lg flex flex-col"
      style={{
        backgroundColor: "#000000",
        borderColor: "#808080",
        borderRadius: "6px",
        boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.5), -1px -1px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Title Bar */}
      <div
        className="px-2 py-1 flex justify-between items-center border-b-2 flex-shrink-0"
        style={{
          background: titleBarColor,
          borderBottomColor: "#808080",
        }}
      >
        <span
          className="font-bold text-xs flex items-center gap-1"
          style={{ fontFamily: "monospace", color: titleBarColor === "#000000" ? "#86EFAC" : "white" }}
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
