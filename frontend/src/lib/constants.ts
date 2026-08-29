import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: 1, name: "Books", created_at: "2026-01-06T07:00:00Z" },
  { id: 2, name: "Electronics", created_at: "2026-01-06T07:01:00Z" },
  { id: 3, name: "Furniture", created_at: "2026-01-06T07:02:00Z" },
  { id: 4, name: "Clothing", created_at: "2026-01-06T07:03:00Z" },
  { id: 5, name: "Accessories", created_at: "2026-01-06T07:04:00Z" },
  { id: 6, name: "Academic Materials", created_at: "2026-01-06T07:05:00Z" },
];

export function getCategoryName(id: number) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? "Uncategorised";
}

export const UNIVERSITY_DOMAIN = "university.edu";