export interface AttendanceStatus {
  id: number;
  code: 'waiting' | 'confirmed' | 'declined';
  label: string;
}

export interface User {
  id: string;
  phone: string;
  slug?: string;
  name: string;
  nickname: string | null;
  avatar_url: string | null;
  attendance_status_id: number | null;
  created_at: string;
  updated_at: string;
  attendance_status?: AttendanceStatus | null;
}

export interface Memory {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  created_at: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string | null;
  mission_order: number;
  type: 'quiz' | 'default';
  created_at: string;
}

export interface QuizAssignment {
  id: string;
  user_id: string;
  mission_id: number;
  quiz_id: string;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  mission_id: number;
  score: number;
  completed: boolean;
  completed_at?: string | null;
  created_at: string;
}

export interface StudentStats {
  level: string;
  graduation_year: string;
  sleep: number;
  bugFixed: number;
  sideQuests: number;
}
