/**
 * MOCK DATA — frontend phase only.
 * Delete this file once the Laravel REST API is connected.
 */
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

export const UNIVERSITY_DOMAIN = "university.edu";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Aqib Rahman",
    email: `aqib.rahman@${UNIVERSITY_DOMAIN}`,
    role: "student",
    status: "active",
    email_verified_at: "2026-02-10T09:00:00Z",
    contact_information: "+880 1710 000001",
    profile_image: null,
    created_at: "2026-02-10T09:00:00Z",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    email: `nusrat.jahan@${UNIVERSITY_DOMAIN}`,
    role: "student",
    status: "active",
    email_verified_at: "2026-02-12T11:20:00Z",
    contact_information: "+880 1710 000002",
    profile_image: null,
    created_at: "2026-02-12T11:20:00Z",
  },
  {
    id: 3,
    name: "Tanvir Hasan",
    email: `tanvir.hasan@${UNIVERSITY_DOMAIN}`,
    role: "student",
    status: "blocked",
    email_verified_at: "2026-03-01T08:05:00Z",
    contact_information: "+880 1710 000003",
    profile_image: null,
    created_at: "2026-03-01T08:05:00Z",
  },
  {
    id: 4,
    name: "Farhana Akter",
    email: `farhana.akter@${UNIVERSITY_DOMAIN}`,
    role: "student",
    status: "active",
    email_verified_at: null,
    contact_information: "+880 1710 000004",
    profile_image: null,
    created_at: "2026-04-18T14:40:00Z",
  },
  {
    id: 99,
    name: "Campus Admin",
    email: `admin@${UNIVERSITY_DOMAIN}`,
    role: "admin",
    status: "active",
    email_verified_at: "2026-01-05T07:00:00Z",
    contact_information: "+880 1710 000099",
    profile_image: null,
    created_at: "2026-01-05T07:00:00Z",
  },
];

export const mockCategories: Category[] = [
  { id: 1, name: "Books", created_at: "2026-01-06T07:00:00Z" },
  { id: 2, name: "Electronics", created_at: "2026-01-06T07:01:00Z" },
  { id: 3, name: "Furniture", created_at: "2026-01-06T07:02:00Z" },
  { id: 4, name: "Clothing", created_at: "2026-01-06T07:03:00Z" },
  { id: 5, name: "Accessories", created_at: "2026-01-06T07:04:00Z" },
  { id: 6, name: "Academic Materials", created_at: "2026-01-06T07:05:00Z" },
];

const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/480`;

export const mockProducts: Product[] = [
  {
    id: 1,
    user_id: 2,
    category_id: 1,
    name: "Introduction to Algorithms (3rd Edition)",
    description:
      "Barely used CLRS copy from last semester. No highlights, spine intact, ideal for the algorithms course.",
    price: 1800,
    condition: "Like New",
    location: "North Hall",
    contact_information: "+880 1710 000002",
    image: img("clrs-book"),
    status: "available",
    created_at: "2026-08-18T10:12:00Z",
  },
  {
    id: 2,
    user_id: 2,
    category_id: 2,
    name: "Casio fx-991EX Scientific Calculator",
    description: "Works perfectly, includes original cover. Used for two semesters of engineering math.",
    price: 1200,
    condition: "Good",
    location: "Engineering Building",
    contact_information: "+880 1710 000002",
    image: img("calculator"),
    status: "available",
    created_at: "2026-08-16T08:30:00Z",
  },
  {
    id: 3,
    user_id: 1,
    category_id: 3,
    name: "Study Desk with Drawer",
    description: "Compact wooden desk that fits dorm rooms. Small scratch on the left leg.",
    price: 3500,
    condition: "Good",
    location: "South Residence",
    contact_information: "+880 1710 000001",
    image: img("study-desk"),
    status: "available",
    created_at: "2026-08-14T16:45:00Z",
  },
  {
    id: 4,
    user_id: 1,
    category_id: 2,
    name: "Logitech Wireless Mouse",
    description: "Silent-click wireless mouse with USB receiver. Battery included.",
    price: 900,
    condition: "Like New",
    location: "Library Block",
    contact_information: "+880 1710 000001",
    image: img("wireless-mouse"),
    status: "sold",
    created_at: "2026-08-02T12:00:00Z",
  },
  {
    id: 5,
    user_id: 3,
    category_id: 4,
    name: "University Hoodie (Size M)",
    description: "Official campus hoodie, washed twice, no fading.",
    price: 1500,
    condition: "Good",
    location: "Student Center",
    contact_information: "+880 1710 000003",
    image: img("hoodie"),
    status: "available",
    created_at: "2026-07-28T09:15:00Z",
  },
  {
    id: 6,
    user_id: 4,
    category_id: 6,
    name: "Organic Chemistry Lab Kit",
    description: "Complete lab kit with goggles, coat and glassware set required for the chemistry lab.",
    price: 2400,
    condition: "New",
    location: "Science Faculty",
    contact_information: "+880 1710 000004",
    image: img("lab-kit"),
    status: "available",
    created_at: "2026-08-20T07:05:00Z",
  },
  {
    id: 7,
    user_id: 4,
    category_id: 5,
    name: "Canvas Backpack",
    description: "Roomy backpack with laptop sleeve. Zippers all functional.",
    price: 1100,
    condition: "Fair",
    location: "West Gate",
    contact_information: "+880 1710 000004",
    image: img("backpack"),
    status: "available",
    created_at: "2026-08-10T18:20:00Z",
  },
  {
    id: 8,
    user_id: 2,
    category_id: 2,
    name: "Dell Inspiron 15 Laptop",
    description: "i5 11th gen, 8GB RAM, 512GB SSD. Upgrading, so selling my current machine.",
    price: 42000,
    condition: "Good",
    location: "North Hall",
    contact_information: "+880 1710 000002",
    image: img("laptop-dell"),
    status: "sold",
    created_at: "2026-07-15T13:50:00Z",
  },
  {
    id: 9,
    user_id: 3,
    category_id: 1,
    name: "Physics for Scientists and Engineers",
    description: "Serway textbook, some pencil notes in the margins.",
    price: 1600,
    condition: "Fair",
    location: "Library Block",
    contact_information: "+880 1710 000003",
    image: img("physics-book"),
    status: "available",
    created_at: "2026-06-30T11:35:00Z",
  },
];

/** Product ids saved by the signed-in demo student. */
export const mockFavoriteProductIds: number[] = [1, 6, 9];

export const mockRequests: PurchaseRequest[] = [
  {
    id: 1,
    product_id: 1,
    buyer_id: 1,
    seller_id: 2,
    status: "pending",
    message: "Is the book still available? I can pick it up tomorrow.",
    created_at: "2026-08-21T09:10:00Z",
  },
  {
    id: 2,
    product_id: 2,
    buyer_id: 1,
    seller_id: 2,
    status: "accepted",
    message: "I would like to buy the calculator.",
    created_at: "2026-08-19T15:00:00Z",
  },
  {
    id: 3,
    product_id: 9,
    buyer_id: 1,
    seller_id: 3,
    status: "rejected",
    message: "Would you take 1400 for it?",
    created_at: "2026-08-12T10:25:00Z",
  },
  {
    id: 4,
    product_id: 3,
    buyer_id: 4,
    seller_id: 1,
    status: "pending",
    message: "Can I see the desk this evening?",
    created_at: "2026-08-22T17:40:00Z",
  },
  {
    id: 5,
    product_id: 3,
    buyer_id: 2,
    seller_id: 1,
    status: "pending",
    message: "Interested. Does it come with the chair?",
    created_at: "2026-08-23T08:00:00Z",
  },
  {
    id: 6,
    product_id: 4,
    buyer_id: 3,
    seller_id: 1,
    status: "accepted",
    message: "Taking the mouse.",
    created_at: "2026-08-01T19:00:00Z",
  },
];

export const mockConversations: Conversation[] = [
  { id: 1, product_id: 1, participant_ids: [1, 2], last_message_at: "2026-08-23T09:40:00Z" },
  { id: 2, product_id: 3, participant_ids: [1, 4], last_message_at: "2026-08-22T18:05:00Z" },
  { id: 3, product_id: 9, participant_ids: [1, 3], last_message_at: "2026-08-12T11:10:00Z" },
];

export const mockMessages: Message[] = [
  {
    id: 1,
    conversation_id: 1,
    sender_id: 1,
    body: "Hi! Is the algorithms book still available?",
    created_at: "2026-08-23T09:20:00Z",
  },
  {
    id: 2,
    conversation_id: 1,
    sender_id: 2,
    body: "Yes it is. I am on campus until 5pm today.",
    created_at: "2026-08-23T09:32:00Z",
  },
  {
    id: 3,
    conversation_id: 1,
    sender_id: 1,
    body: "Perfect, I will come by the library around 3.",
    created_at: "2026-08-23T09:40:00Z",
  },
  {
    id: 4,
    conversation_id: 2,
    sender_id: 4,
    body: "Does the desk fit in a standard dorm room?",
    created_at: "2026-08-22T17:50:00Z",
  },
  {
    id: 5,
    conversation_id: 2,
    sender_id: 1,
    body: "It does, it is 90cm wide. I can send more photos.",
    created_at: "2026-08-22T18:05:00Z",
  },
  {
    id: 6,
    conversation_id: 3,
    sender_id: 1,
    body: "Would you consider 1400 for the physics book?",
    created_at: "2026-08-12T11:00:00Z",
  },
  {
    id: 7,
    conversation_id: 3,
    sender_id: 3,
    body: "Sorry, the price is fixed.",
    created_at: "2026-08-12T11:10:00Z",
  },
];

export const mockReports: Report[] = [
  {
    id: 1,
    reporter_id: 1,
    target_type: "product",
    target_id: 5,
    reason: "Misleading Listing",
    description: "The photo does not match the described size.",
    status: "pending",
    created_at: "2026-08-20T13:00:00Z",
  },
  {
    id: 2,
    reporter_id: 2,
    target_type: "user",
    target_id: 3,
    reason: "Suspicious User",
    description: "Asked for advance payment outside campus.",
    status: "pending",
    created_at: "2026-08-21T10:30:00Z",
  },
  {
    id: 3,
    reporter_id: 4,
    target_type: "product",
    target_id: 7,
    reason: "Spam",
    description: "Same listing posted several times.",
    status: "resolved",
    created_at: "2026-08-05T09:00:00Z",
  },
];

export const mockStatistics: DashboardStatistics = {
  total_users: mockUsers.length,
  total_products: mockProducts.length,
  available_products: mockProducts.filter((p) => p.status === "available").length,
  sold_products: mockProducts.filter((p) => p.status === "sold").length,
  total_requests: mockRequests.length,
  total_reports: mockReports.length,
  total_categories: mockCategories.length,
};

export function getUser(id: number) {
  return mockUsers.find((u) => u.id === id);
}
export function getProduct(id: number) {
  return mockProducts.find((p) => p.id === id);
}
export function getCategoryName(id: number) {
  return mockCategories.find((c) => c.id === id)?.name ?? "Uncategorised";
}
export function formatPrice(value: number) {
  return `BDT ${value.toLocaleString("en-US")}`;
}
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
