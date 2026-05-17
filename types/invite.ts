export interface User {
  id: string;
  phone: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  user_id: string;
  slug: string;
  personalized_message: string;
  graduation_year: string;
  status: 'pending' | 'confirmed' | 'declined';
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvitationWithUser extends Invitation {
  user: User;
}

export interface Memory {
  id: string;
  invitation_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export interface StudentStats {
  level: string;
  graduation_year: string;
  sleep: number;
  bugFixed: number;
  sideQuests: number;
}
