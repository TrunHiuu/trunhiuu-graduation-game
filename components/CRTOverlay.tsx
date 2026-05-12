import { motion } from "framer-motion";
import React from "react";

export default function CRTOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* CRT Scan Lines */}
      <motion.div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 0.1, repeat: Infinity }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)",
        }}
      />

      {/* Corner Dust */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gray-900 to-transparent opacity-10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gray-900 to-transparent opacity-10" />
    </div>
  );
}
