"use client";

import CRTOverlay from "@/components/CRTOverlay";
import FloatingParticles from "@/components/FloatingParticles";
import TwinklingStars from "@/components/TwinklingStars";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/invite/by-phone?phone=${encodeURIComponent(phone)}`);
      
      if (!response.ok) {
        setError("Không tìm thấy mời tham dự. Vui lòng kiểm tra lại số điện thoại.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      router.push(`/invite/${data.invitation.slug}`);
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen w-full overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: "url('/login_background.png')" }}
    >
      {/* Center content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-end px-8 pb-64">
        {/* Pixel Art Login Window - Match Reference */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "340px",
          filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.6))"
        }}>
          {/* Thick Black Outer Border - Level 3 */}
          <div style={{
            backgroundColor: "#000000",
            padding: "4px",
            borderRadius: "0px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
          }}>
            {/* Dark Gray Middle Frame - Level 2 */}
            <div style={{
              backgroundColor: "#404040",
              padding: "2px",
              border: "1px solid #808080",
              boxShadow: "inset 1px 1px 0 #666666, inset -1px -1px 0 #000000"
            }}>
              {/* White Inner Frame - Level 1 */}
              <div style={{
                backgroundColor: "#ffffff",
                padding: "3px",
                border: "1px solid #e0e0e0",
                boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #c0c0c0"
              }}>
                {/* Main Container */}
                <div style={{
                  backgroundColor: "#c0c0c0",
                  border: "2px solid",
                  borderColor: "#ffffff #303030 #303030 #ffffff",
                  boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #606060"
                }}>
                  {/* Header Box - Dark Blue with 3D effect */}
                  <div style={{
                    backgroundColor: "#1e5aa8",
                    border: "2px solid",
                    borderColor: "#4a8ace #0a2a6a #0a2a6a #4a8ace",
                    padding: "10px 10px",
                    textAlign: "center",
                    margin: "3px 3px 0px 3px",
                    boxShadow: "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000"
                  }}>
                    <p style={{
                      fontFamily: "Arial Black, monospace",
                      fontSize: "12px",
                      fontWeight: "900",
                      color: "#ffffff",
                      margin: "0",
                      letterSpacing: "1px",
                      textShadow: "2px 2px 0 #000000, -1px -1px 0 rgba(255,255,255,0.3)",
                      lineHeight: "1.2"
                    }}>
                      TrunHiu Graduation
                      <br />
                      Invitation
                    </p>
                  </div>

                  {/* Light Blue Content Area with border */}
                  <div style={{
                    backgroundColor: "#c0d9f0",
                    border: "2px solid",
                    borderColor: "#e8f5ff #4a7ab8 #4a7ab8 #e8f5ff",
                    padding: "14px 12px",
                    margin: "3px 3px 3px 3px",
                    minHeight: "160px",
                    boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #6a8ab8"
                  }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {/* Phone Input Section */}
                      <div style={{
                        padding: "6px",
                        backgroundColor: "#b0d0e8",
                        border: "1px solid",
                        borderColor: "#d8e8f8 #4a6a98 #4a6a98 #d8e8f8",
                        boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #505080"
                      }}>
                        <label style={{
                          fontSize: "10px",
                          fontWeight: "900",
                          fontFamily: "Arial, monospace",
                          color: "#001a66",
                          display: "block",
                          marginBottom: "6px",
                          letterSpacing: "1px",
                          textShadow: "1px 1px 0 rgba(255,255,255,0.5)"
                        }}>
                          PHONE NUMBER
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter Your Phone Number!"
                          disabled={loading}
                          style={{
                            width: "100%",
                            padding: "6px",
                            backgroundColor: "#ffffff",
                            border: "1px solid",
                            borderColor: "#505080 #ffffff #ffffff #505080",
                            fontFamily: "Courier New, monospace",
                            fontSize: "11px",
                            color: "#000080",
                            boxSizing: "border-box",
                            outline: "none",
                            boxShadow: "inset 1px 1px 0 #505080, inset -1px -1px 0 #ffffff",
                            fontWeight: "bold"
                          }}
                        />
                      </div>

                      {error && (
                        <div style={{
                          backgroundColor: "#ff9999",
                          border: "1px solid",
                          borderColor: "#ff0000 #660000 #660000 #ff0000",
                          padding: "6px",
                          textAlign: "center",
                          boxShadow: "inset 1px 1px 0 #ffaaaa, inset -1px -1px 0 #550000"
                        }}>
                          <p style={{
                            fontSize: "10px",
                            fontFamily: "Arial, monospace",
                            color: "#550000",
                            margin: "0",
                            fontWeight: "bold",
                            letterSpacing: "1px"
                          }}>
                            ERROR: {error}
                          </p>
                        </div>
                      )}

                      {/* Button with frame */}
                      <div style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "2px",
                        backgroundColor: "#9abacc",
                        border: "1px solid",
                        borderColor: "#d0e0f0 #404060 #404060 #d0e0f0",
                        boxShadow: "inset 1px 1px 0 #e0f0ff, inset -1px -1px 0 #303050"
                      }}>
                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            backgroundColor: "#1e5aa8",
                            border: "2px solid",
                            borderColor: loading ? "#0a2a6a #1a4a8a #1a4a8a #0a2a6a" : "#4a8ace #0a2a6a #0a2a6a #4a8ace",
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
                            boxShadow: loading ? "inset 1px 1px 0 #0a2a6a" : "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000",
                            minWidth: "110px"
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
        </div>
      </div>

      {/* Floating Particles - Animated Stars */}
      <FloatingParticles />

      {/* Twinkling Stars - Sparkle Effects */}
      <TwinklingStars />

      {/* CRT Effect */}
      <CRTOverlay />
    </main>
  );
}
