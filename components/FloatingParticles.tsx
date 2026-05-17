import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  isTopZone: boolean;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Only generate particles on client to avoid hydration mismatch
    const newParticles = Array.from({ length: 200 }).map((_, i) => {
      const initialY = Math.random() * 100;
      const isTopZone = initialY < 33.33; // Top 1/3 is blue zone
      
      return {
        id: i,
        initialX: Math.random() * 100,
        initialY: initialY,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 3,
        isTopZone,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full opacity-70`}
          style={{
            width: particle.isTopZone ? "4px" : "3px",
            height: particle.isTopZone ? "4px" : "3px",
            backgroundColor: particle.isTopZone ? "#00ffff" : "#ff99cc",
            boxShadow: particle.isTopZone ? "0 0 8px #00ffff, 0 0 16px #0099ff" : "0 0 6px #ff99cc",
          }}
          initial={{
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            top: `${particle.initialY - 40}%`,
            opacity: [0, 0.8, 0.4, 0],
            scale: [0, 1, 0.9, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
