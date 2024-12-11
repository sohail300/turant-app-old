import { number } from "zod";

export interface User {
  user_id: number;
  display_name: string; // Full name of the user
  username: string; // Unique username
  phone: string; // Phone number
  email: string; // Email address
  city: string; // City of residence
  state: string; // State of residence
  type: "Basic" | "Verified"; // User type
  follower_count: number; // Number of followers
  totalPosts: number; // Total posts by the user
  lastPost: string; // Date of the last post
  app_language: string; // Languages used by the user
  created_at: string; // Date of joining
  banTill: string; // Date of ban
  lastBan: string; // Date of last ban
}

export interface Reporter {
  reporter_id: number; // Unique identifier for the reporter
  name: string; // Full name of the user
  image: string; // Profile image
  phone: string; // Phone number
  state: string; // State of residence
  district: string; // District of residence
  block: string; // Block of residence
}

export interface Advertiser {
  company_name: string;
  start_date: string;
  end_date: string;
  duration: string;
  total_views: number;
  total_clicks: number;
  target_city: string;
  target_state: string;
  cost: string;
  detail: string;
}
