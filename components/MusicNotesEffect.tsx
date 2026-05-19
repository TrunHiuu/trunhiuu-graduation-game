"use client";

import React, { useEffect, useState } from "react";

interface MusicNote {
  id: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  duration: number;
  note: string;
}

const MUSIC_NOTES = ["♪", "♫", "♬", "♭", "♮"];

interface MusicNotesEffectProps {
  trigger: boolean;
  onComplete?: () => void;
  color?: "pink" | "cyan";
}

export default function MusicNotesEffect({ trigger, onComplete, color = "pink" }: MusicNotesEffectProps) {
  const [notes, setNotes] = useState<MusicNote[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Create music notes from button center (around 50%, 55%)
    const newNotes: MusicNote[] = Array.from({ length: 8 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.3;
      const distance = 150 + Math.random() * 100;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = -Math.sin(angle) * distance;
      const duration = 1.5 + Math.random() * 0.5;

      return {
        id: i,
        startX: 50,
        startY: 55,
        offsetX,
        offsetY,
        duration,
        note: MUSIC_NOTES[i % MUSIC_NOTES.length],
      };
    });

    setNotes(newNotes);

    // Clear notes after animation completes
    const timer = setTimeout(() => {
      setNotes([]);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
        {notes.map((note) => {
          const noteColor = color === "cyan" ? "#00ffff" : "#ff6ec7";
          const noteShadow = color === "cyan" ? "0 0 10px #00ffff, 0 0 20px #0099ff" : "0 0 10px #ff99cc, 0 0 20px #ff66b2";
          
          return (
            <div
              key={note.id}
              style={{
                position: "absolute",
                left: `${note.startX}%`,
                top: `${note.startY}%`,
                fontSize: "28px",
                fontWeight: "bold",
                color: noteColor,
                textShadow: noteShadow,
                pointerEvents: "none",
                opacity: 1,
                animation: `musicNoteFloat${note.id} ${note.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              } as React.CSSProperties}
            >
              {note.note}
            </div>
          );
        })}
      </div>
      <style>{`
        ${notes.map((note) => `
          @keyframes musicNoteFloat${note.id} {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(${note.offsetX}px, ${note.offsetY}px) scale(0.3) rotate(360deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </>
  );
}
