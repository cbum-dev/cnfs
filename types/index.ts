export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  bio: string | null;
  profile_photo: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  style_prefs: string[] | null;
  size_prefs: string[] | null;
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  brand: string | null;
  size: string | null;
  condition: string | null;
  price: number | null;
  is_swap_only: boolean;
  photos: string[];
  status: string;
  created_at: string;
}

export interface Swipe {
  id: string;
  user_id: string;
  item_id: string;
  direction: 'left' | 'right';
  created_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  item1_id: string | null;
  item2_id: string | null;
  status: string;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  text: string | null;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Filters {
  category?: string | null;
  size?: string | null;
  maxPrice?: number | null;
  maxDistanceKm?: number | null;
}
