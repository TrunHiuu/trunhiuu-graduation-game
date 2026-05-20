import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function normalizePhone(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.startsWith("84") && digitsOnly.length >= 11) {
    return `0${digitsOnly.slice(2)}`;
  }

  return digitsOnly;
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  try {
    const normalizedPhone = normalizePhone(phone);

    if (!/^\d{6,}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    console.log("Searching for phone:", normalizedPhone);
    
    // Step 1: Fetch all users and compare with normalized phone so stored formatting doesn't matter.
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, phone, name, nickname, avatar_url, attendance_status_id, created_at, updated_at");

    if (usersError) {
      console.error("Supabase error:", usersError);
      throw usersError;
    }

    const user = (users || []).find((entry) => normalizePhone(entry.phone) === normalizedPhone) ?? null;

    console.log("User result:", { user });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Step 2: Fetch attendance status separately
    const { data: attendanceStatus } = await supabase
      .from("attendance_statuses")
      .select("id, code, label")
      .eq("id", user.attendance_status_id)
      .maybeSingle();

    return NextResponse.json({
      user: {
        ...user,
        attendance_status: attendanceStatus ?? null,
      },
    });
  } catch (error) {
    console.error("Error in by-phone route:", error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

