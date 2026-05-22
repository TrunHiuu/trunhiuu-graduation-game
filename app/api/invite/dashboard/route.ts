import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Lấy thông tin người dùng
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, nickname, attendance_status_id");

    if (usersError) throw usersError;

    // Lấy thông tin trạng thái tham dự
    const { data: statuses, error: statusesError } = await supabase
      .from("attendance_statuses")
      .select("id, code, label");

    if (statusesError) throw statusesError;

    // Lấy thông tin điểm số
    const { data: scores, error: scoresError } = await supabase
      .from("scores")
      .select("user_id, mission_id, score");

    if (scoresError) throw scoresError;

    const formattedUsers = (users || []).map((user) => {
      const status = statuses?.find((s) => s.id === user.attendance_status_id);
      
      const userScores = (scores || []).filter((s) => s.user_id === user.id);
      const scoresRecord: Record<number, boolean> = {
        1: false, 2: false, 3: false, 4: false,
      };

      userScores.forEach((s) => {
        scoresRecord[s.mission_id] = (s.score > 0);
      });

      return {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        status: status?.code || "waiting",
        statusLabel: status?.label || "Waiting",
        scores: scoresRecord,
      };
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}