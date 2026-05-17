"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TwinklingStar {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
  brightness: number;
}

export default function TwinklingStars() {
  const [stars, setStars] = useState<TwinklingStar[]>([]);

  useEffect(() => {
    // Generate many twinkling stars across the screen
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 4,
      size: 1 + Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "#ffffff",
            left: `${star.x}%`,
            top: `${star.y}%`,
            filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))",
          }}
          animate={{
            opacity: [0, star.brightness, 0, star.brightness * 0.6, 0],
            scale: [0.5, 1, 0.8, 1, 0.5],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
