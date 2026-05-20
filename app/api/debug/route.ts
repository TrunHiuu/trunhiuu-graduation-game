import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET() {
  try {
    const supabase = getSupabase();

    // Check users table
    const { data: usersData, error: usersError, count: usersCount } = await supabase
      .from("users")
      .select("*", { count: "exact" });

    const { data: attendanceStatusesData, error: attendanceStatusesError, count: attendanceStatusesCount } = await supabase
      .from("attendance_statuses")
      .select("*", { count: "exact" });

    const { data: missionsData, error: missionsError, count: missionsCount } = await supabase
      .from("missions")
      .select("*", { count: "exact" });

    const { data: quizzesData, error: quizzesError, count: quizzesCount } = await supabase
      .from("quizzes")
      .select("*", { count: "exact" });

    return NextResponse.json({
      users: {
        count: usersCount || 0,
        error: usersError?.message,
        sample: usersData?.slice(0, 2),
      },
      attendance_statuses: {
        count: attendanceStatusesCount || 0,
        error: attendanceStatusesError?.message,
        sample: attendanceStatusesData?.slice(0, 2),
      },
      missions: {
        count: missionsCount || 0,
        error: missionsError?.message,
        sample: missionsData?.slice(0, 2),
      },
      quizzes: {
        count: quizzesCount || 0,
        error: quizzesError?.message,
        sample: quizzesData?.slice(0, 2),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) });
  }
}
