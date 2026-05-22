"use client";

import React, { useEffect, useState } from "react";
import PlayerStatsWindow from "@/components/PlayerStats";
import { StudentStats, User } from "@/types/invite";
import { Star, PushPin } from "phosphor-react";

type SimpleScore = { score: number; completed: boolean; completed_at?: string | null };

type DashboardUser = {
  id: string;
  name: string;
  nickname: string;
  status: "waiting" | "confirmed" | "declined";
  statusLabel: string;
  scores: Record<number, boolean>;
};

type Props = { 
  stats?: StudentStats;
  user: User;
  scores: Record<number, SimpleScore | undefined>;
};

export default function DashboardWindow({ stats, user, scores }: Props) {
  const [allUsers, setAllUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/invite/dashboard");
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Tự động load lại dữ liệu mỗi 3 giây (3,000ms) để thấy các user khác cập nhật
    const interval = setInterval(fetchDashboard, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sắp xếp: Current user lên đầu -> confirmed -> waiting -> declined
  const sortedUsers = [...allUsers].sort((a, b) => {
    if (a.id === user?.id) return -1;
    if (b.id === user?.id) return 1;

    const statusOrder = { confirmed: 1, waiting: 2, declined: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const getStatusColor = (status: string) => {
    if (status === "confirmed") return "text-green-600";
    if (status === "declined") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <PlayerStatsWindow
      stats={stats as any}
      title="DashBoard.exe"
      titleBarColor="#FFA500"
      outerBg="#ffffff"
      contentBg="#f8f9fa"
    >
      <div className="flex flex-col font-mono text-xs">
        <div className="font-bold text-gray-700 mb-2 border-b-2 border-gray-300 pb-1 flex justify-between text-[10px] uppercase">
          <span className="w-1/3 text-left">PLAYER</span>
          <span className="w-1/3 text-left">STATUS</span>
          <span className="w-1/3 text-left">SCORES</span>
        </div>
        
        <div className="overflow-y-auto pr-1 h-[160px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {loading && allUsers.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">Loading data...</div>
          ) : (
            sortedUsers.map((u) => {
              const isCurrentUser = u.id === user?.id;
              const textColor = getStatusColor(u.status);

              return (
                <div 
                  key={u.id} 
                  className="flex items-center h-8 flex-shrink-0"
                >
                  <div className="w-1/3 flex items-center gap-1 truncate pr-2">
                    {isCurrentUser && <PushPin size={10} weight="fill" className="text-red-600 flex-shrink-0" />}
                    <span className={`font-bold text-[10px] truncate ${textColor}`}>
                      {u.nickname || u.name}
                    </span>
                  </div>
                  
                  <div className={`w-1/3 text-left font-bold text-[10px] ${textColor}`}>
                    {u.status}
                  </div>
                  
                  <div className="w-1/3 flex justify-start gap-0.5">
                    {[1, 2, 3, 4].map((missionId) => (
                      <Star 
                        key={missionId} 
                        size={12} 
                        weight="fill" 
                        color={u.scores[missionId] ? '#ffd54a' : '#d1d5db'} 
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PlayerStatsWindow>
  );
}
