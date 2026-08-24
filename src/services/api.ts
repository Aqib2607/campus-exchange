/**
 * Centralized API boundary.
 *
 * FRONTEND PHASE ONLY: no real HTTP calls are made yet. Each function below
 * resolves mock data after a short delay so the UI can demonstrate loading,
 * success, empty and error states.
 *
 * When the Laravel REST API exists, replace each body with the matching
 * Axios call (base URL: import.meta.env.VITE_API_URL + "/api"). The exported
 * signatures and the types in src/types are intentionally stable so no UI
 * code needs restructuring.
 *
 * Future resource groups:
 *   /auth /users /products /categories /favorites
 *   /requests /conversations /messages /reports /admin
 */
import {
  mockCategories,
  mockConversations,
  mockMessages,
  mockProducts,
  mockReports,
  mockRequests,
  mockStatistics,
  mockUsers,
} from "@/lib/mock-data";
import type {
  Category,
  Conversation,
  DashboardStatistics,
  Message,
  Product,
  PurchaseRequest,
  Report,
  User,
} from "@/types";

const LATENCY = 350;

function resolve<T>(data: T, delay = LATENCY): Promise<T> {
  return new Promise((r) => setTimeout(() => r(data), delay));
}

export const api = {
  products: {
    list: () => resolve<Product[]>(mockProducts),
    get: (id: number) => resolve<Product | undefined>(mockProducts.find((p) => p.id === id)),
    byUser: (userId: number) => resolve<Product[]>(mockProducts.filter((p) => p.user_id === userId)),
  },
  categories: {
    list: () => resolve<Category[]>(mockCategories),
  },
  users: {
    list: () => resolve<User[]>(mockUsers),
    get: (id: number) => resolve<User | undefined>(mockUsers.find((u) => u.id === id)),
  },
  requests: {
    list: () => resolve<PurchaseRequest[]>(mockRequests),
  },
  conversations: {
    list: () => resolve<Conversation[]>(mockConversations),
    messages: (conversationId: number) =>
      resolve<Message[]>(mockMessages.filter((m) => m.conversation_id === conversationId)),
  },
  reports: {
    list: () => resolve<Report[]>(mockReports),
  },
  admin: {
    statistics: () => resolve<DashboardStatistics>(mockStatistics),
  },
};
