import { motion } from "framer-motion";
import React from "react";

export default function FloatingParticles() {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60"
          initial={{
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: 0,
          }}
          animate={{
            top: `${particle.initialY - 30}%`,
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
