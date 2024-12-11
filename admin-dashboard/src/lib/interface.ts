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
  notes: string; // Additional notes
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
  name: string; // Advertiser company name
  start_date: string; // Start date of the campaign (formatted as a string, e.g., "YYYY-MM-DD")
  end_date: string; // End date of the campaign (formatted as a string, e.g., "YYYY-MM-DD")
  duration: string; // Duration of the campaign (e.g., "30 days")
  total_reach: number; // Total reach of the campaign (e.g., number of people reached)
  target_city: string; // Targeted city for the campaign
  target_state: string; // Targeted state for the campaign
  cost: string; // Cost of the campaign (e.g., "₹5000")
  detail: string; // Placeholder for action-related details (e.g., button or view handler)
}
