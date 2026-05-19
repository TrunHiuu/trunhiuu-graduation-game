"use client";

import React, { useEffect, useState } from "react";

interface InputNote {
  id: number;
  posX: number;
  posY: number;
  offsetX: number;
  offsetY: number;
  duration: number;
  note: string;
}

const CYAN_NOTES = ["♪", "♫"];

interface InputMusicNoteEffectProps {
  trigger: number;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function InputMusicNoteEffect({ trigger, inputRef }: InputMusicNoteEffectProps) {
  const [notes, setNotes] = useState<InputNote[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    // Get input position
    const inputElement = inputRef?.current;
    if (!inputElement) return;

    const rect = inputElement.getBoundingClientRect();
    const posX = rect.left + rect.width / 2;
    const posY = rect.top + rect.height / 2;

    // Create single music note
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 50;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = -Math.sin(angle) * distance;
    const duration = 1.2 + Math.random() * 0.4;
    const noteId = Date.now() + Math.random();

    const newNote: InputNote = {
      id: noteId,
      posX,
      posY,
      offsetX,
      offsetY,
      duration,
      note: CYAN_NOTES[Math.floor(Math.random() * CYAN_NOTES.length)],
    };

    setNotes((prev) => [...prev, newNote]);

    // Remove note after animation
    const timer = setTimeout(() => {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }, duration * 1000 + 300);

    return () => clearTimeout(timer);
  }, [trigger, inputRef]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              position: "fixed",
              left: `${note.posX}px`,
              top: `${note.posY}px`,
              transform: "translate(-50%, -50%)",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#00ffff",
              textShadow: "0 0 8px #00ffff, 0 0 16px #0099ff",
              pointerEvents: "none",
              animation: `inputMusicNoteFloat${Math.floor(note.id)} ${note.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            } as React.CSSProperties}
          >
            {note.note}
          </div>
        ))}
      </div>
      <style>{`
        ${notes.map((note) => `
          @keyframes inputMusicNoteFloat${Math.floor(note.id)} {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(calc(-50% + ${note.offsetX}px), calc(-50% + ${note.offsetY}px)) scale(0) rotate(360deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </>
  );
}
