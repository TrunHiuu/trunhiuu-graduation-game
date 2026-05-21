"use client";

import React from "react";
import PlayerStatsWindow from "@/components/PlayerStats";
import { StudentStats, User } from "@/types/invite";
import { Star } from 'phosphor-react';
type SimpleScore = { score: number; completed: boolean; completed_at?: string | null };
type Props = { stats: StudentStats; user: User; scores: Record<number, SimpleScore | undefined> };

export default function PlayerWindow({ stats, user, scores }: Props) {
  const completedCount = [1, 2, 3, 4].filter((missionId) => Boolean(scores[missionId]?.completed)).length;
  const fillPercent = (completedCount / 4) * 100;
  const fillHeight = `${fillPercent}%`;
  const starLevels = [4, 3, 2, 1];

  return (
    <PlayerStatsWindow
      stats={stats}
      title="Player.exe"
      titleBarColor="#FF69B4"
      outerBg="#ffffff"
      contentBg="#ffffff"
    >
      <style>{`
        @keyframes vertical-progress-stripes {
          from { background-position: 0 0; }
          to { background-position: 0 16px; }
        }
        .vertical-loading-stripes {
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 8px, transparent 8px, transparent 16px);
          background-size: 16px 16px;
          animation: vertical-progress-stripes 1s linear infinite;
        }
        @keyframes avatar-anim {
          0%, 20%, 40%, 60%, 80% { transform: translateY(0) rotateY(0deg); }
          10%, 30%, 50%, 70% { transform: translateY(-8px) rotateY(0deg); }
          90% { transform: translateY(-8px) rotateY(180deg); }
          100% { transform: translateY(0) rotateY(360deg); }
        }
        .avatar-float-spin {
          animation: avatar-anim 15s ease-in-out infinite;
        }
      `}</style>
      <div className="p-3 mt-2" style={{ fontFamily: 'var(--font-roboto)' }}>
        <div className="flex flex-col gap-1">
          <div>
            <div className="text-gray-700" style={{ fontSize: '13px', fontWeight: 800 }}>Player: <span style={{ color: '#d4a017' }}>{user.nickname || user.name}</span></div>
            <div className="text-gray-700" style={{ fontSize: '13px', fontWeight: 800 }}>Status: <span style={{ color: user.attendance_status?.code === 'confirmed' ? '#16a34a' : user.attendance_status?.code === 'declined' ? '#dc2626' : '#9ca3af', fontWeight: 700 }}>{user.attendance_status?.label ?? 'waiting'}</span></div>
          </div>

          <div className="mt-3 flex items-start gap-4">
            {/* Left: vertical progress + stars (1/3) */}
            <div className="w-1/3 flex justify-center">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 22, height: 220, overflow: 'visible', flexShrink: 0 }}>
                <div className="bg-gray-300 border border-gray-400 shadow-lg" style={{ position: 'absolute', inset: 0, borderRadius: 10, padding: 3, boxSizing: 'border-box' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Phần lõi thanh bar - bị giới hạn bởi overflow: hidden */}
                    <div className="bg-white shadow-inner" style={{ position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: fillHeight,
                          background: 'linear-gradient(to top, #ff57c8 0%, #8bf6ff 48%, #7cff9b 100%)',
                          transition: 'height 500ms ease-out',
                        }}
                      >
                        <div className="absolute inset-0 vertical-loading-stripes"></div>
                      </div>
                      {[25, 50, 75].map((offset) => (
                        <div
                          key={offset}
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: `${offset}%`,
                            height: 1,
                            background: 'rgba(0,0,0,0.08)',
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Lớp biểu tượng Degree - nằm ngoài vùng overflow để không bị cắt */}
                    {fillPercent > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: `calc(${fillHeight} - 14px)`,
                          transform: 'translateX(-50%)',
                          width: 38,
                          height: 38,
                          zIndex: 10,
                          pointerEvents: 'none',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/degree-removebg-preview.png"
                          alt="meter cap"
                          className="object-contain w-full h-full"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 226, marginTop: -6 }}>
                {starLevels.map((missionId) => {
                  const s = scores[missionId];
                  const starColor = s?.score === 1 ? '#ffd54a' : '#9ca3af';
                  return (
                    <div key={missionId} className="flex items-center" style={{ height: 56 }}>
                      <Star size={20} weight="fill" color={starColor} />
                    </div>
                  );
                })}
              </div>
            </div>
            </div>

            {/* Right: avatar (2/3) */}
            <div className="w-2/3 flex justify-center items-center">
              <div className="w-[220px] h-[220px] rounded-md overflow-hidden flex-shrink-0 avatar-float-spin">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="avatar" width={220} height={220} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ color: '#4b5563', fontWeight: 800, fontSize: 96 }}>{(user.nickname||user.name||'')[0]}</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PlayerStatsWindow>
  );
}
 
