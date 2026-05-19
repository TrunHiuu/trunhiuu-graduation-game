"use client";

/* eslint-disable @next/next/no-img-element */

import CRTOverlay from "@/components/CRTOverlay";
import FloatingParticles from "@/components/FloatingParticles";
import MusicToggleButton from "@/components/MusicToggleButton";
import TwinklingStars from "@/components/TwinklingStars";
import MusicNotesEffect from "@/components/MusicNotesEffect";
import { useBackgroundMusicControl } from "@/components/BackgroundMusic";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const INVITE_ACCESS_KEY = "graduation-invite-access-slug";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showMusicNotes, setShowMusicNotes] = useState(false);
  const [showGoMusicNotes, setShowGoMusicNotes] = useState(false);
  const [isWelcomeButtonPressed, setIsWelcomeButtonPressed] = useState(false);
  const [isGoButtonPressed, setIsGoButtonPressed] = useState(false);
  const { setPlaying: setMusicPlaying } = useBackgroundMusicControl();
  const router = useRouter();

  const handleWelcomeOK = () => {
    setShowWelcome(false);
    setMusicPlaying(true);
    // Show login popup after 300ms
    setTimeout(() => {
      setShowLoginPopup(true);
    }, 300);
  };

  const handleWelcomeButtonMouseDown = () => {
    setIsWelcomeButtonPressed(true);
  };

  const handleWelcomeButtonMouseUp = () => {
    setIsWelcomeButtonPressed(false);
    setShowMusicNotes(true);
    handleWelcomeOK();
  };

  const handleGoButtonMouseDown = () => {
    setIsGoButtonPressed(true);
  };

  const handleGoButtonMouseUp = () => {
    setIsGoButtonPressed(false);
    setShowGoMusicNotes(true);
  };

  // Reset Go music notes effect after animation completes
  useEffect(() => {
    if (showGoMusicNotes) {
      const timer = setTimeout(() => {
        setShowGoMusicNotes(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showGoMusicNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/invite/by-phone?phone=${encodeURIComponent(phone)}`);
      
      if (!response.ok) {
        setError("Invitation not found. Please verify your phone number.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      sessionStorage.setItem(INVITE_ACCESS_KEY, data.invitation.slug);
      router.push(`/invite/${data.invitation.slug}`);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen w-full overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: "url('/login_background.png')" }}
    >
      {/* Welcome Modal */}
      {showWelcome && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: "#c0c0c0",
              border: "2px solid",
              borderColor: "#ffffff #303030 #303030 #ffffff",
              padding: "20px",
              maxWidth: "400px",
              boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #606060, 0 0 20px rgba(0,0,0,0.8)"
            }}
          >
            <div
              style={{
                backgroundColor: "#d4669b",
                border: "2px solid",
                borderColor: "#f0a8d8 #6d2860 #6d2860 #f0a8d8",
                padding: "12px",
                textAlign: "center",
                marginBottom: "15px",
                boxShadow: "inset 1px 1px 0 #f0a8d8, inset -1px -1px 0 #000000"
              }}
            >
              <p
                style={{
                  fontFamily: "Arial Black, monospace",
                  fontSize: "14px",
                  fontWeight: "900",
                  color: "#ffffff",
                  margin: "0",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 0 #000000"
                }}
              >
                Welcome!
              </p>
            </div>

            <p
              style={{
                fontFamily: "Arial, monospace",
                fontSize: "13px",
                color: "#000000",
                textAlign: "center",
                margin: "0 0 20px 0",
                lineHeight: "1.5"
              }}
            >
              Welcome to the TrunHiuu Graduation Game.
              <br />
              Click OK to continue
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2px",
                backgroundColor: "#9abacc",
                border: "1px solid",
                borderColor: "#d0e0f0 #404060 #404060 #d0e0f0",
                boxShadow: "inset 1px 1px 0 #e0f0ff, inset -1px -1px 0 #303050"
              }}
            >
              <button
                onMouseDown={handleWelcomeButtonMouseDown}
                onMouseUp={handleWelcomeButtonMouseUp}
                style={{
                  backgroundColor: isWelcomeButtonPressed ? "#a83d6e" : "#d4669b",
                  border: "2px solid",
                  borderColor: isWelcomeButtonPressed ? "#6d2860 #f0a8d8 #f0a8d8 #6d2860" : "#f0a8d8 #6d2860 #6d2860 #f0a8d8",
                  padding: "10px 30px",
                  fontFamily: "Arial Black, monospace",
                  fontSize: "13px",
                  fontWeight: "900",
                  color: "#ffffff",
                  cursor: "pointer",
                  textAlign: "center",
                  letterSpacing: "2px",
                  textShadow: "1px 1px 0 #000000",
                  outline: "none",
                  boxShadow: isWelcomeButtonPressed 
                    ? "inset -1px -1px 0 #f0a8d8, inset 1px 1px 0 #000000" 
                    : "inset 1px 1px 0 #f0a8d8, inset -1px -1px 0 #000000",
                  transform: isWelcomeButtonPressed ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.05s ease-out"
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music Toggle Button - Top Right */}
      <MusicToggleButton />

      {/* Center content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-end px-8 pb-64">
        {/* Character - Position at 1/4 from left, 1/3 from bottom */}
        <motion.img
          src="/Character_login_1-removebg-preview.png"
          alt="Graduation Character"
          animate={{
            y: [0, -10, 0],
            rotate: [0, -0.6, 0.6, 0],
            scaleY: [1, 0.985, 1],
          }}
          transition={{
            duration: 2.4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.75,
          }}
          draggable={false}
          style={{
            position: "absolute",
            left: "23%",
            bottom: "1%",
            width: "auto",
            height: "auto",
            maxWidth: "225px",
            maxHeight: "275px",
            objectFit: "contain",
            transformOrigin: "bottom center",
          }}
        />

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, -0.6, 0.6, 0],
            scaleY: [1, 0.985, 1],
          }}
          transition={{
            duration: 2.4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            right: "23%",
            bottom: "1%",
            transformOrigin: "bottom center",
          }}
        >
          <img
            src="/Character_login_2-removebg-preview.png"
            alt="Graduation Character 2"
            draggable={false}
            style={{
              display: "block",
              width: "auto",
              height: "auto",
              maxWidth: "225px",
              maxHeight: "275px",
              objectFit: "contain",
            }}
          />
        </motion.div>

        {/* Login Form - Pop-up with Animation */}
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "340px",
              filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.6))"
            }}
          >
            <div style={{ backgroundColor: "#000000", padding: "4px", borderRadius: "0px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}>
              <div style={{ backgroundColor: "#404040", padding: "2px", border: "1px solid #808080", boxShadow: "inset 1px 1px 0 #666666, inset -1px -1px 0 #000000" }}>
                <div style={{ backgroundColor: "#ffffff", padding: "3px", border: "1px solid #e0e0e0", boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #c0c0c0" }}>
                  <div style={{ backgroundColor: "#c0c0c0", border: "2px solid", borderColor: "#ffffff #303030 #303030 #ffffff", boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #606060" }}>
                    <div style={{ backgroundColor: "#1e5aa8", border: "2px solid", borderColor: "#4a8ace #0a2a6a #0a2a6a #4a8ace", padding: "10px 10px", textAlign: "center", margin: "3px 3px 0px 3px", boxShadow: "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000" }}>
                      <p style={{ fontFamily: "Arial Black, monospace", fontSize: "12px", fontWeight: "900", color: "#ffffff", margin: "0", letterSpacing: "1px", textShadow: "2px 2px 0 #000000, -1px -1px 0 rgba(255,255,255,0.3)", lineHeight: "1.2" }}>
                        TrunHiu Graduation<br />Invitation
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#c0d9f0", border: "2px solid", borderColor: "#e8f5ff #4a7ab8 #4a7ab8 #e8f5ff", padding: "14px 12px", margin: "3px 3px 3px 3px", minHeight: "160px", boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #6a8ab8" }}>
                      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ padding: "6px", backgroundColor: "#b0d0e8", border: "1px solid", borderColor: "#d8e8f8 #4a6a98 #4a6a98 #d8e8f8", boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #505080" }}>
                          <label style={{ fontSize: "10px", fontWeight: "900", fontFamily: "Arial, monospace", color: "#001a66", display: "block", marginBottom: "6px", letterSpacing: "1px", textShadow: "1px 1px 0 rgba(255,255,255,0.5)" }}>
                            PHONE NUMBER
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter Your Phone Number!"
                            disabled={loading}
                            style={{ width: "100%", padding: "6px", backgroundColor: "#ffffff", border: "1px solid", borderColor: "#505080 #ffffff #ffffff #505080", fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#000080", boxSizing: "border-box", outline: "none", boxShadow: "inset 1px 1px 0 #505080, inset -1px -1px 0 #ffffff", fontWeight: "bold", letterSpacing: "1px" }}
                          />
                        </div>
                        {error && (
                          <div style={{ backgroundColor: "#ff9999", border: "1px solid", borderColor: "#ff0000 #660000 #660000 #ff0000", padding: "6px", textAlign: "center", boxShadow: "inset 1px 1px 0 #ffaaaa, inset -1px -1px 0 #550000" }}>
                            <p style={{ fontSize: "10px", fontFamily: "Arial, monospace", color: "#550000", margin: "0", fontWeight: "bold", letterSpacing: "1px" }}>
                              ERROR: {error}
                            </p>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "center", padding: "2px", backgroundColor: "#9abacc", border: "1px solid", borderColor: "#d0e0f0 #404060 #404060 #d0e0f0", boxShadow: "inset 1px 1px 0 #e0f0ff, inset -1px -1px 0 #303050" }}>
                          <button
                            type="submit"
                            disabled={loading}
                            onMouseDown={handleGoButtonMouseDown}
                            onMouseUp={handleGoButtonMouseUp}
                            style={{ 
                              backgroundColor: isGoButtonPressed && !loading ? "#165295" : "#1e5aa8", 
                              border: "2px solid", 
                              borderColor: isGoButtonPressed && !loading ? "#0a2a6a #4a8ace #4a8ace #0a2a6a" : loading ? "#0a2a6a #1a4a8a #1a4a8a #0a2a6a" : "#4a8ace #0a2a6a #0a2a6a #4a8ace", 
                              padding: "10px 20px", 
                              fontFamily: "Arial Black, monospace", 
                              fontSize: "13px", 
                              fontWeight: "900", 
                              color: "#ffffff", 
                              cursor: loading ? "not-allowed" : "pointer", 
                              opacity: loading ? 0.7 : 1, 
                              textAlign: "center", 
                              letterSpacing: "2px", 
                              textShadow: "1px 1px 0 #000000", 
                              outline: "none", 
                              boxShadow: isGoButtonPressed && !loading ? "inset -1px -1px 0 #4a8ace, inset 1px 1px 0 #000000" : loading ? "inset 1px 1px 0 #0a2a6a" : "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000", 
                              minWidth: "110px",
                              transform: isGoButtonPressed && !loading ? "scale(0.98)" : "scale(1)",
                              transition: "all 0.05s ease-out"
                            }}
                          >
                            {loading ? "LOADING" : "Go!"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Particles - Animated Stars */}
      <FloatingParticles />

      {/* Music Notes Effect - Pink (Welcome OK button) */}
      <MusicNotesEffect trigger={showMusicNotes} />

      {/* Music Notes Effect - Cyan (Go button) */}
      <MusicNotesEffect trigger={showGoMusicNotes} color="cyan" />

      {/* Twinkling Stars - Sparkle Effects */}
      <TwinklingStars />

      {/* CRT Effect */}
      <CRTOverlay />
    </main>
  );
}
