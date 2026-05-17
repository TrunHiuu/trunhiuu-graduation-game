import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    console.log("Starting setup...");

    // Insert users (không xóa dữ liệu cũ)
    const { data: users, error: usersError } = await supabase
      .from("users")
      .insert([
        { phone: "0343437536", name: "Đào Trung Hiếu" },
        { phone: "0984301741", name: "Trần Hữu Phước" },
        { phone: "0987654321", name: "Dương Bách Đạt" },
      ])
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

    // Insert invitations
    const invitationData = [
      {
        user_id: users[0].id,
        slug: "dao-trung-hieu",
        personalized_message:
          "Chúc mừng bạn hoàn thành khoá học! Hãy cùng chúng tôi ăn mừng ngày tốt nghiệp tại lễ kỷ niệm.",
        graduation_year: "2026",
      },
      {
        user_id: users[1].id,
        slug: "tran-huu-phuoc",
        personalized_message:
          "Bạn thực sự tuyệt vời! Hãy đến dự buổi lễ tốt nghiệp của chúng tôi.",
        graduation_year: "2026",
      },
      {
        user_id: users[2].id,
        slug: "duong-bach-dat",
        personalized_message:
          "Kỷ niệm 4 năm đại học sắp kết thúc. Hãy cùng chúng tôi tạo dấu ấn cuối cùng!",
        graduation_year: "2026",
      },
    ];

    const { error: invitationsError } = await supabase
      .from("invitations")
      .insert(invitationData);

    console.log("Invitations insert result:", { error: invitationsError });

    if (invitationsError) {
      console.error("Invitations error:", invitationsError);
      return NextResponse.json(
        { error: `Failed to insert invitations: ${invitationsError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Database setup completed successfully",
      users: users.map((u) => ({ id: u.id, phone: u.phone, name: u.name })),
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
