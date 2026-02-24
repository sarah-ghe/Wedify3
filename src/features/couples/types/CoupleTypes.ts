export interface Couple {
  id: string;
  user_id: string;
  email: string;
  username?: string;
  phone_number?: string;
  created_at: string;
}

export interface WeddingProfile {
  id: string;
  user_id: string;
  wedding_date: string;
  budget: number;
  region: string;
  guest_count: number;
  venue_preference?: string;
}
