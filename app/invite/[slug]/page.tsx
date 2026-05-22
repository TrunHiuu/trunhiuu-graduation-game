"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MissionWindow from "@/components/MissionWindow";
import NotificationWindow from "@/components/NotificationWindow";
import DashboardWindow from "@/components/DashboardWindow";
import PlayerWindow from "@/components/PlayerWindow";
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
  const [scores, setScores] = useState<Record<number, { score: number; completed: boolean; completed_at?: string | null }>>({});
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
            <NotificationWindow title="Notification.exe" titleBarColor="#000000" />
          </div>

          {/* Column 2-3: Mission (full height) */}
          <div className="col-span-2 h-full flex items-center justify-center">
            <MissionWindow user={user} setUser={setUser} scores={scores} setScores={setScores} />
          </div>

          {/* Column 4: Stack DashBoard and Player - equal height, total height = other columns */}
          <div className="col-span-1 h-full flex flex-col gap-4">
            {/* Top: DashBoard */}
            <div className="h-fit">
              <DashboardWindow stats={studentStats} user={user} scores={scores} />
            </div>

            {/* Bottom: Player */}
            <div className="h-fit max-h-[346px]">
              <PlayerWindow stats={studentStats} user={user} scores={scores} />
            </div>
          </div>
        </div>
      </div>

      {/* CRT Effect */}
      <CRTOverlay />
    </div>
  );
}
