import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch invite data
    const { data: invite, error: inviteError } = await supabase
      .from("invites")
      .select("*")
      .eq("slug", slug)
      .single();

    if (inviteError) {
      return NextResponse.json(
        { error: "Invite not found" },
        { status: 404 }
      );
    }

    // Fetch memories
    const { data: memories } = await supabase
      .from("memories")
      .select("*")
      .eq("invite_id", invite.id);

    return NextResponse.json({
      invite,
      memories: memories || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
