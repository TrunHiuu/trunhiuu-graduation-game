import React from "react";
import { motion } from "framer-motion";
import { User, Invitation } from "@/types/invite";

interface PlayerCharacterProps {
  user: User;
  invitation: Invitation;
}

function generateCharacterStats(user: User, invitation: Invitation) {
  // Tạo hash từ tên và SĐT để tạo stats không đổi cho mỗi user
  const seed = `${user.name}${user.phone}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const random = (min: number, max: number) => {
    const x = Math.sin(hash++) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  return {
    name: user.name,
    level: Math.floor(parseInt(invitation.graduation_year) - 2020),
    hp: random(80, 120),
    strength: random(10, 18),
    intelligence: random(10, 18),
    wisdom: random(10, 18),
    charisma: random(12, 20),
    agility: random(10, 18),
    defense: random(8, 15),
    experience: random(1000, 5000),
    specialAbility: generateSpecialAbility(user),
  };
}

function generateSpecialAbility(user: User) {
  const abilities = [
    { name: "Debugging Master", desc: "Tìm được lỗi trong mã của kẻ thù" },
    { name: "Knowledge Burst", desc: "Phát tán kiến thức tới toàn bộ đồng đội" },
    { name: "Time Manipulation", desc: "Giảm thời gian hoàn thành dự án" },
    { name: "Leadership Aura", desc: "Tăng moral của toàn bộ nhóm" },
    { name: "Caffeine Rush", desc: "Tăng tốc độ làm việc 5x trong 10 phút" },
    { name: "Perfect Balance", desc: "Cân bằng công việc và cuộc sống hoàn hảo" },
  ];

  const nameLength = user.name.length;
  return abilities[nameLength % abilities.length];
}

export default function PlayerCharacter({ user, invitation }: PlayerCharacterProps) {
  const stats = generateCharacterStats(user, invitation);

  // Lấy chữ cái đầu của tên để tạo avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bg-gradient-to-b from-purple-300 to-purple-400 border-4 border-gray-800 shadow-lg"
      style={{
        width: "380px",
        right: "20px",
        bottom: "20px",
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3), inset 2px 2px 0px rgba(255, 255, 255, 0.5)",
      }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-2 py-1 border-b-2 border-gray-800">
        <span className="text-white font-bold text-xs" style={{ fontFamily: "Press Start 2P" }}>
          Player.exe
        </span>
      </div>

      {/* Content */}
      <div className="p-3 h-auto space-y-2">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 border-2 border-gray-800 flex items-center justify-center font-bold text-2xl"
            style={{ fontFamily: "Press Start 2P" }}>
            {initials}
          </div>
        </div>

        {/* Name & Class */}
        <div className="text-center border-b border-gray-800 pb-2">
          <p className="text-xs font-bold" style={{ fontFamily: "Press Start 2P" }}>
            {stats.name}
          </p>
          <p className="text-xs text-gray-700">LV. {stats.level}</p>
        </div>

        {/* Stats */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>HP:</span>
            <span className="font-bold text-red-600">{stats.hp}</span>
          </div>
          <div className="w-full bg-gray-300 border border-gray-600 h-2">
            <div className="bg-red-500 h-full" style={{ width: `${(stats.hp / 150) * 100}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
            <div>
              <span className="font-bold">STR:</span> {stats.strength}
            </div>
            <div>
              <span className="font-bold">INT:</span> {stats.intelligence}
            </div>
            <div>
              <span className="font-bold">WIS:</span> {stats.wisdom}
            </div>
            <div>
              <span className="font-bold">CHA:</span> {stats.charisma}
            </div>
          </div>
        </div>

        {/* Special Ability */}
        <div className="border-t border-gray-800 pt-2 mt-2">
          <p className="text-xs font-bold text-purple-900">{stats.specialAbility.name}</p>
          <p className="text-xs text-gray-700">{stats.specialAbility.desc}</p>
        </div>

        {/* Experience */}
        <div className="border-t border-gray-800 pt-2 mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold">EXP</span>
            <span>{stats.experience}</span>
          </div>
          <div className="w-full bg-gray-300 border border-gray-600 h-2">
            <div className="bg-blue-500 h-full" style={{ width: `${(stats.experience / 5000) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
