-- ========================================
-- CLEAN UP - Xóa các bảng cũ
-- ========================================
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- TẠO BẢNG USERS - Lưu khách mời
-- ========================================
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- TẠO BẢNG INVITATIONS - Lưu thiệp mời
-- ========================================
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  personalized_message TEXT,
  graduation_year TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, declined
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- TẠO BẢNG MEMORIES - Lưu hình ảnh kỷ niệm
-- ========================================
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- TẠO INDEX để tăng tốc độ query
-- ========================================
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_memories_invitation_id ON memories(invitation_id);

-- ========================================
-- INSERT DỮ LIỆU TEST
-- ========================================
INSERT INTO users (phone, name) VALUES
  ('0343437536', 'Đào Trung Hiếu'),
  ('0984301741', 'Trần Hữu Phước'),
  ('0987654321', 'Dương Bách Đạt');

-- Thêm invitations
INSERT INTO invitations (user_id, slug, personalized_message, graduation_year) VALUES
  (
    (SELECT id FROM users WHERE phone = '0343437536'),
    'dao-trung-hieu',
    'Chúc mừng bạn hoàn thành khoá học! Hãy cùng chúng tôi ăn mừng ngày tốt nghiệp tại lễ kỷ niệm.',
    '2026'
  ),
  (
    (SELECT id FROM users WHERE phone = '0984301741'),
    'tran-huu-phuoc',
    'Bạn thực sự tuyệt vời! Hãy đến dự buổi lễ tốt nghiệp của chúng tôi.',
    '2026'
  ),
  (
    (SELECT id FROM users WHERE phone = '0987654321'),
    'duong-bach-dat',
    'Kỷ niệm 4 năm đại học sắp kết thúc. Hãy cùng chúng tôi tạo dấu ấn cuối cùng!',
    '2026'
  );

-- ========================================
-- KIỂM TRA DỮ LIỆU
-- ========================================
SELECT 'Users:' as section;
SELECT * FROM users;

SELECT 'Invitations:' as section;
SELECT i.id, u.name, u.phone, i.slug, i.personalized_message, i.graduation_year, i.status
FROM invitations i
JOIN users u ON i.user_id = u.id;
