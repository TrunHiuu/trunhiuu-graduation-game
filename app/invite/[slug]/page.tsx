"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PixelWindow from "@/components/PixelWindow";
import TerminalWindow from "@/components/TerminalWindow";
import StudentStatsWindow from "@/components/StudentStats";
import MemoryGallery from "@/components/MemoryGallery";
import CRTOverlay from "@/components/CRTOverlay";
import FloatingParticles from "@/components/FloatingParticles";
import { Invite, Memory, StudentStats } from "@/types/invite";

export default function InvitePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [invite, setInvite] = useState<Invite | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/invite?slug=${slug}`);
        const data = await response.json();

        if (data.invite) {
          setInvite(data.invite);
          setMemories(data.memories || []);
        }
      } catch (error) {
        console.error("Error fetching invite:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-yellow-900 via-orange-400 to-orange-300 flex items-center justify-center">
        <div className="text-center">
          <p style={{ fontFamily: "Press Start 2P" }} className="text-white text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-yellow-900 via-orange-400 to-orange-300 flex items-center justify-center">
        <div className="text-center">
          <p style={{ fontFamily: "Press Start 2P" }} className="text-white text-sm">
            Invitation not found
          </p>
        </div>
      </div>
    );
  }

  const studentStats: StudentStats = {
    level: "Senior",
    major: invite.major,
    sleep: -999,
    bugFixed: Infinity,
    sideQuests: 42,
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-yellow-900 via-orange-400 to-orange-300 overflow-hidden">
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Desktop Windows */}
      <div className="relative w-full h-full">
        {/* Main Invitation Window */}
        <PixelWindow
          title="Invitation.exe"
          width="500px"
          height="350px"
          x={100}
          y={80}
        >
          <div className="space-y-3">
            <div>
              <p style={{ fontFamily: "Press Start 2P" }} className="text-sm text-blue-900">
                Dear {invite.name},
              </p>
            </div>

            <p className="text-xs">{invite.personalized_message}</p>

            <div className="border-t-2 border-gray-800 pt-3">
              <p className="text-xs font-bold">📅 Graduation Year: {invite.graduation_year}</p>
              <p className="text-xs font-bold">📍 Event Location: TBA</p>
            </div>

            <button className="w-full bg-blue-500 border-2 border-gray-800 text-white text-xs font-bold py-2 hover:bg-blue-600">
              Confirm Attendance
            </button>
          </div>
        </PixelWindow>

        {/* Terminal Window */}
        <TerminalWindow />

        {/* Student Stats */}
        <StudentStatsWindow stats={studentStats} />

        {/* Memory Gallery */}
        {memories.length > 0 && <MemoryGallery memories={memories} />}
      </div>

      {/* CRT Effect */}
      <CRTOverlay />
    </div>
  );
}
