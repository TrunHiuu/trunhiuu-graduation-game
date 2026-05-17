import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Check users table
    const { data: usersData, error: usersError, count: usersCount } = await supabase
      .from("users")
      .select("*", { count: "exact" });

    // Check invites table (cũ)
    let invitesCount = 0;
    let invitesError = null;
    let invitesData = null;
    try {
      const result = await supabase
        .from("invites")
        .select("*", { count: "exact" });
      invitesData = result.data;
      invitesError = result.error;
      invitesCount = result.count || 0;
    } catch (e: any) {
      invitesError = e.message;
    }

    // Check invitations table (mới)
    const { data: invitationsData, error: invitationsError, count: invitationsCount } = await supabase
      .from("invitations")
      .select("*", { count: "exact" });

    return NextResponse.json({
      users: {
        count: usersCount || 0,
        error: usersError?.message,
        sample: usersData?.slice(0, 2),
      },
      invites: {
        count: invitesCount || 0,
        error: invitesError?.message,
        sample: invitesData?.slice(0, 2),
      },
      invitations: {
        count: invitationsCount || 0,
        error: invitationsError?.message,
        sample: invitationsData?.slice(0, 2),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
