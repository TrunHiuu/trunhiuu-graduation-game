import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const id = request.nextUrl.searchParams.get("id");

  if (!slug && !id) {
    return NextResponse.json(
      { error: "Slug or ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch invitation data
    let query = supabase.from("invitations").select("*");
    
    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("slug", slug);
    }

    const { data: invitation, error: invitationError } = await query.single();

    if (invitationError) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", invitation.user_id)
      .single();

    // Fetch memories
    const { data: memories } = await supabase
      .from("memories")
      .select("*")
      .eq("invitation_id", invitation.id);

    return NextResponse.json({
      user,
      invitation,
      memories: memories || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
