import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type Mission3AnswerRow = {
  id: string;
  user_id: string;
  answer: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at?: string | null;
};

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: submission, error } = await supabase
      .from("mission3_answers")
      .select("id, user_id, answer, submitted_at, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle()
      .returns<Mission3AnswerRow | null>();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      submission,
      isSubmitted: Boolean(submission?.answer),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as
      | { userId?: string; answer?: string }
      | null;

    const userId = body?.userId;
    const answer = body?.answer?.trim();

    if (!userId || !answer) {
      return NextResponse.json(
        { error: "userId and answer are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    // enforce ordering: mission 2 must be completed first
    const { data: prevScore, error: prevErr } = await supabase
      .from("scores")
      .select("completed")
      .eq("user_id", userId)
      .eq("mission_id", 2)
      .maybeSingle();

    if (prevErr) throw prevErr;
    if (!prevScore || !prevScore.completed) {
      return NextResponse.json({ error: "Previous mission not completed" }, { status: 403 });
    }

    const { data: existingSubmission, error: fetchError } = await supabase
      .from("mission3_answers")
      .select("id, answer, submitted_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (existingSubmission?.answer) {
      return NextResponse.json({
        submission: existingSubmission,
        isSubmitted: true,
      });
    }

    const submittedAt = new Date().toISOString();
    const payload = existingSubmission
      ? { answer, submitted_at: submittedAt, updated_at: submittedAt }
      : { user_id: userId, answer, submitted_at: submittedAt };

    const { data: submission, error: saveError } = existingSubmission
      ? await supabase
          .from("mission3_answers")
          .update(payload)
          .eq("id", existingSubmission.id)
            .select("id, user_id, answer, submitted_at, created_at, updated_at")
          .maybeSingle()
      : await supabase
          .from("mission3_answers")
          .insert(payload as any)
            .select("id, user_id, answer, submitted_at, created_at, updated_at")
          .maybeSingle();

    if (saveError) {
      throw saveError;
    }

    // mark mission 3 as completed with score=1
    try {
      const { error: scoreErr } = await supabase
        .from("scores")
        .upsert(
          {
            user_id: userId,
            mission_id: 3,
            score: 1,
            completed: true,
            completed_at: submittedAt,
          },
          { onConflict: "user_id,mission_id" },
        );

      if (scoreErr) {
        throw scoreErr;
      }
    } catch (e) {
      console.error("Failed to upsert score for mission 3:", e);
    }

    return NextResponse.json({
      submission,
      isSubmitted: Boolean(submission?.answer),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}