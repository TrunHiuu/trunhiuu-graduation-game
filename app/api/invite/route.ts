import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSlug } from "@/lib/slug";

function normalizePhone(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.startsWith("84") && digitsOnly.length >= 11) {
    return `0${digitsOnly.slice(2)}`;
  }

  return digitsOnly;
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");
  const id = request.nextUrl.searchParams.get("id");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!phone && !id && !slug) {
    return NextResponse.json(
      { error: "Phone, ID, or slug is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, phone, name, nickname, avatar_url, attendance_status_id, created_at, updated_at");

    if (usersError) {
      throw usersError;
    }

    const normalizedSlug = slug ? createSlug(slug) : null;
    const normalizedPhone = phone ? normalizePhone(phone) : null;

    const user = (users || []).find((entry) => {
      if (id) {
        return entry.id === id;
      }

      if (normalizedSlug) {
        return createSlug(entry.name) === normalizedSlug;
      }

      return normalizedPhone ? normalizePhone(entry.phone) === normalizedPhone : false;
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

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
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
