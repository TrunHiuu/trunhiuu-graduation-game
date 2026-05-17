import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Searching for phone:", phone);
    
    // Fetch user by phone
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    console.log("User result:", { user, error: userError });

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found", details: userError?.message },
        { status: 404 }
      );
    }

    // Fetch invitation for this user
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log("Invitation result:", { invitation, error: invitationError });

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: "Invitation not found", details: invitationError?.message },
        { status: 404 }
      );
    }

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
    console.error("Error in by-phone route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

