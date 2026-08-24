// Typed contracts mirroring the future Laravel REST API resources.
// These types are the boundary the API layer will fill in later.

export type UserRole = "student" | "admin";
export type UserStatus = "active" | "blocked";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at: string | null;
  contact_information: string;
  profile_image: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export type ProductCondition = "New" | "Like New" | "Good" | "Fair";
export type ProductStatus = "available" | "sold";

export interface Product {
  id: number;
  user_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  condition: ProductCondition;
  location: string;
  contact_information: string;
  image: string;
  status: ProductStatus;
  created_at: string;
}

export type RequestStatus = "pending" | "accepted" | "rejected";

export interface PurchaseRequest {
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  status: RequestStatus;
  message: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  product_id: number;
  participant_ids: [number, number];
  last_message_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  created_at: string;
}

export type ReportTargetType = "product" | "user";
export type ReportStatus = "pending" | "resolved";
export type ReportReason =
  | "Spam"
  | "Inappropriate Content"
  | "Misleading Listing"
  | "Suspicious User"
  | "Other";

export interface Report {
  id: number;
  reporter_id: number;
  target_type: ReportTargetType;
  target_id: number;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  created_at: string;
}

export interface DashboardStatistics {
  total_users: number;
  total_products: number;
  available_products: number;
  sold_products: number;
  total_requests: number;
  total_reports: number;
  total_categories: number;
}

export type AsyncState = "idle" | "loading" | "success" | "error";
