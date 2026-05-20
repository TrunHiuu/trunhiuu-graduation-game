"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PixelWindow from "@/components/PixelWindow";
import TerminalWindow from "@/components/TerminalWindow";
import StudentStatsWindow from "@/components/StudentStats";
import CRTOverlay from "@/components/CRTOverlay";
import FloatingParticles from "@/components/FloatingParticles";
import MusicToggleButton from "@/components/MusicToggleButton";
import PlayerCharacter from "@/components/PlayerCharacter";
import { User, StudentStats } from "@/types/invite";
const INVITE_ACCESS_KEY = "graduation-login-slug";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [minimumLoadingDone, setMinimumLoadingDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumLoadingDone(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const allowedSlug = sessionStorage.getItem(INVITE_ACCESS_KEY);

      if (allowedSlug !== slug) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(`/api/invite?slug=${encodeURIComponent(slug)}`);

        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else {
          console.warn("No user data returned:", data);
        }
      } catch (error) {
        console.error("Error fetching invite:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, slug]);

  if (loading || !minimumLoadingDone) {
    return (
      <div 
        className="navy-loading-screen w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/main_background.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="relative z-10 flex w-[min(58vw,300px)] flex-col items-center">
          <div className="degree-loading-track">
            <div className="degree-loading-fill" />
            <img
              src="/degree-removebg-preview.png"
              alt=""
              className="degree-loading-icon"
              draggable={false}
            />
          </div>
          <p style={{ fontFamily: "var(--font-roboto)" }} className="text-white text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/main_background.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="text-center">
          <p style={{ fontFamily: "var(--font-roboto)" }} className="text-white text-sm">
            User not found
          </p>
        </div>
      </div>
    );
  }

  const studentStats: StudentStats = {
    level: user.attendance_status?.code === "confirmed" ? "Confirmed" : "Player",
    graduation_year: "2026",
    sleep: -999,
    bugFixed: Infinity,
    sideQuests: 42,
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundImage: "url('/main_background.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <MusicToggleButton />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Desktop Windows - vertically centered */}
      <div className="flex h-full w-full items-center justify-center px-4 py-6">
        <div className="grid h-[calc(100vh-140px)] w-full max-w-[1600px] grid-cols-4 gap-4">
          {/* Column 1: Notification (full height) */}
          <div className="col-span-1 h-full">
            <TerminalWindow title="Notification.exe" titleBarColor="#000000" />
          </div>

          {/* Column 2-3: Mission (full height) */}
          <div className="col-span-2 h-full flex items-center justify-center">
            <PixelWindow
              title="Mission.exe"
              width="100%"
              height="100%"
              titleBarColor="#0066CC"
            >
              <div className="space-y-3">
                <div>
                  <p style={{ fontFamily: "var(--font-roboto)" }} className="text-sm text-blue-900">
                    Dear {user.nickname || user.name},
                  </p>
                </div>

                <p style={{ fontFamily: "var(--font-roboto)", fontSize: "12px" }} className="text-xs">
                  Welcome to the graduation mission window. Use the buttons below to confirm or decline attendance.
                </p>

                <div className="border-t-2 border-gray-800 pt-3">
                  <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs font-bold">Nickname: {user.nickname || "N/A"}</p>
                  <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs font-bold">Attendance: {user.attendance_status?.label || "Waiting"}</p>
                  <p style={{ fontFamily: "var(--font-roboto)" }} className="text-xs font-bold">Event Location: TBA</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button style={{ fontFamily: "var(--font-roboto)" }} className="w-full bg-red-500 border-2 border-gray-800 text-white text-xs font-bold py-2 hover:bg-red-600">
                    Deny
                  </button>
                  <button style={{ fontFamily: "var(--font-roboto)" }} className="w-full bg-blue-500 border-2 border-gray-800 text-white text-xs font-bold py-2 hover:bg-blue-600">
                    Confirm
                  </button>
                </div>
              </div>
            </PixelWindow>
          </div>

          {/* Column 4: Stack DashBoard and Player - equal height, total height = other columns */}
          <div className="col-span-1 h-full flex flex-col gap-4">
            {/* Top: DashBoard */}
            <div className="flex-1">
              <StudentStatsWindow
                stats={studentStats}
                title="DashBoard.exe"
                titleBarColor="#FFA500"
              />
            </div>

            {/* Bottom: Player */}
            <div className="flex-1">
              <StudentStatsWindow
                stats={studentStats}
                title="Player.exe"
                titleBarColor="#FF69B4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CRT Effect */}
      <CRTOverlay />
    </div>
  );
}
