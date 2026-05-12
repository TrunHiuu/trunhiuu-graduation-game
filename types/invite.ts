export interface Invite {
  id: string;
  slug: string;
  phone: string;
  name: string;
  major: string;
  personalized_message: string;
  avatar_url: string;
  graduation_year: string;
  created_at: string;
}

export interface Memory {
  id: string;
  invite_id: string;
  image_url: string;
  caption: string;
}

export interface StudentStats {
  level: string;
  major: string;
  sleep: number;
  bugFixed: number;
  sideQuests: number;
}
