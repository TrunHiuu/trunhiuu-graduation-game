import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST() {
  try {
    const supabase = getSupabaseAdmin();

    console.log("Starting setup...");

    const attendanceStatusesSeed = [
      { code: "waiting", label: "Waiting" },
      { code: "confirmed", label: "Confirmed" },
      { code: "declined", label: "Declined" },
    ];

    const { error: attendanceStatusUpsertError } = await supabase
      .from("attendance_statuses")
      .upsert(attendanceStatusesSeed, { onConflict: "code" });

    if (attendanceStatusUpsertError) {
      return NextResponse.json(
        { error: `Failed to seed attendance statuses: ${attendanceStatusUpsertError.message}` },
        { status: 500 }
      );
    }

    const { data: attendanceStatuses, error: attendanceStatusError } = await supabase
      .from("attendance_statuses")
      .select("id, code, label");

    if (attendanceStatusError) {
      return NextResponse.json(
        { error: `Failed to read attendance statuses: ${attendanceStatusError.message}` },
        { status: 500 }
      );
    }

    const waitingStatusId = attendanceStatuses?.find((status) => status.code === "waiting")?.id;

    if (!waitingStatusId) {
      return NextResponse.json(
        { error: "Waiting attendance status not found" },
        { status: 500 }
      );
    }

    const missionsSeed = [
      {
        title: "Quiz Challenge",
        description: "Answer the first random quiz challenge",
        mission_order: 1,
        type: "quiz",
      },
      {
        title: "Quiz Challenge",
        description: "Answer the second random quiz challenge",
        mission_order: 2,
        type: "quiz",
      },
      {
        title: "Wish Crafting Odyssey",
        description: "Write a wish for me",
        mission_order: 3,
        type: "default",
      },
      {
        title: "Photographic Finale",
        description: "Take a photo with me",
        mission_order: 4,
        type: "default",
      },
    ] as const;

    const { data: existingMissions, error: existingMissionsError } = await supabase
      .from("missions")
      .select("mission_order");

    if (existingMissionsError) {
      return NextResponse.json(
        { error: `Failed to read existing missions: ${existingMissionsError.message}` },
        { status: 500 }
      );
    }

    const existingMissionOrders = new Set((existingMissions || []).map((mission) => mission.mission_order));
    const missionsToInsert = missionsSeed.filter((mission) => !existingMissionOrders.has(mission.mission_order));

    if (missionsToInsert.length > 0) {
      const { error: missionsError } = await supabase
        .from("missions")
        .insert(missionsToInsert);

      if (missionsError) {
        return NextResponse.json(
          { error: `Failed to seed missions: ${missionsError.message}` },
          { status: 500 }
        );
      }
    }

    const quizzesSeed = [
      {
        question: "What year did UIT officially become a university member of VNU-HCM?",
        option_a: "2000",
        option_b: "2006",
        option_c: "2010",
        option_d: "2015",
        correct_option: "B",
      },
      {
        question: "Which programming language is mainly used for Android native development?",
        option_a: "Swift",
        option_b: "Kotlin",
        option_c: "PHP",
        option_d: "Ruby",
        correct_option: "B",
      },
      {
        question: "What does SQL stand for?",
        option_a: "Structured Query Language",
        option_b: "Simple Query Language",
        option_c: "Sequential Query Logic",
        option_d: "System Query Language",
        correct_option: "A",
      },
      {
        question: "Which HTML tag is used to display an image?",
        option_a: "<img>",
        option_b: "<image>",
        option_c: "<picture>",
        option_d: "<src>",
        correct_option: "A",
      },
      {
        question: "Which company created React?",
        option_a: "Google",
        option_b: "Microsoft",
        option_c: "Meta",
        option_d: "Apple",
        correct_option: "C",
      },
      {
        question: "Which database is Supabase built on top of?",
        option_a: "MySQL",
        option_b: "MongoDB",
        option_c: "SQLite",
        option_d: "PostgreSQL",
        correct_option: "D",
      },
      {
        question: "What does CSS stand for?",
        option_a: "Creative Style System",
        option_b: "Cascading Style Sheets",
        option_c: "Computer Styled Sections",
        option_d: "Colorful Style Syntax",
        correct_option: "B",
      },
      {
        question: "Which Git command uploads local commits to remote repository?",
        option_a: "git clone",
        option_b: "git commit",
        option_c: "git push",
        option_d: "git init",
        correct_option: "C",
      },
      {
        question: "Which JavaScript method converts JSON string to object?",
        option_a: "JSON.parse()",
        option_b: "JSON.stringify()",
        option_c: "JSON.object()",
        option_d: "JSON.convert()",
        correct_option: "A",
      },
      {
        question: "Which HTTP status code means Not Found?",
        option_a: "200",
        option_b: "301",
        option_c: "404",
        option_d: "500",
        correct_option: "C",
      },
    ] as const;

    const { data: existingQuizzes, error: existingQuizzesError } = await supabase
      .from("quizzes")
      .select("question");

    if (existingQuizzesError) {
      return NextResponse.json(
        { error: `Failed to read existing quizzes: ${existingQuizzesError.message}` },
        { status: 500 }
      );
    }

    const existingQuestions = new Set((existingQuizzes || []).map((quiz) => quiz.question));
    const quizzesToInsert = quizzesSeed.filter((quiz) => !existingQuestions.has(quiz.question));

    if (quizzesToInsert.length > 0) {
      const { error: quizzesError } = await supabase
        .from("quizzes")
        .insert(quizzesToInsert);

      if (quizzesError) {
        return NextResponse.json(
          { error: `Failed to seed quizzes: ${quizzesError.message}` },
          { status: 500 }
        );
      }
    }

    // Seed users idempotently so login works even after rerunning setup
    const seedUsers = [
      {
        phone: "0343437536",
        name: "Đào Trung Hiếu",
        nickname: "TrunHiuu",
        avatar_url:
          "https://ehfodawhdhqpyrculrli.supabase.co/storage/v1/object/public/Users%20profile%20picture%20for%20TrunHiuu%20graduation%20game/dao-trung-hieu.png",
        attendance_status_id: waitingStatusId,
      },
      {
        phone: "0984301741",
        name: "Trần Hữu Phước",
        nickname: "Phuoc",
        attendance_status_id: waitingStatusId,
      },
      {
        phone: "0987654321",
        name: "Dương Bách Đạt",
        nickname: "Dat",
        attendance_status_id: waitingStatusId,
      },
    ];

    const { data: existingUsers, error: existingUsersError } = await supabase
      .from("users")
      .select("id, phone, name");

    if (existingUsersError) {
      return NextResponse.json(
        { error: `Failed to read existing users: ${existingUsersError.message}` },
        { status: 500 }
      );
    }

    const existingPhones = new Set((existingUsers || []).map((user) => user.phone));
    const usersToInsert = seedUsers.filter((user) => !existingPhones.has(user.phone));

    if (usersToInsert.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .insert(usersToInsert)
        .select();

      console.log("Users insert result:", { users, error: usersError });

      if (usersError) {
        console.error("Users error:", usersError);
        return NextResponse.json(
          { error: `Failed to insert users: ${usersError.message}` },
          { status: 500 }
        );
      }

      if (!users || users.length === 0) {
        return NextResponse.json(
          { error: "No users returned from insert" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Database setup completed successfully",
      users: seedUsers.map((u) => ({ phone: u.phone, name: u.name, nickname: u.nickname })),
    });
  } catch (error: unknown) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  }
}
