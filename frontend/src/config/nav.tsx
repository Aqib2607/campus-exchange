import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
  Users,
  Tag,
  Flag,
  BarChart2,
} from "lucide-react";
import type { SidebarLink } from "@/components/layout/DashboardShell";

export const studentLinks: SidebarLink[] = [
  { to: "/dashboard", label: "Overview", icon: () => <LayoutDashboard className="h-4 w-4" /> },
  { to: "/dashboard/listings", label: "My Listings", icon: () => <Package className="h-4 w-4" /> },
  { to: "/dashboard/requests", label: "Requests", icon: () => <ShoppingBag className="h-4 w-4" /> },
  { to: "/dashboard/favorites", label: "Favorites", icon: () => <Heart className="h-4 w-4" /> },
  { to: "/dashboard/messages", label: "Messages", icon: () => <MessageSquare className="h-4 w-4" /> },
  { to: "/dashboard/profile", label: "Profile", icon: () => <User className="h-4 w-4" /> },
];

export const adminLinks: SidebarLink[] = [
  { to: "/admin", label: "Dashboard", icon: () => <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/users", label: "Users", icon: () => <Users className="h-4 w-4" /> },
  { to: "/admin/products", label: "Products", icon: () => <Package className="h-4 w-4" /> },
  { to: "/admin/categories", label: "Categories", icon: () => <Tag className="h-4 w-4" /> },
  { to: "/admin/reports", label: "Reports", icon: () => <Flag className="h-4 w-4" /> },
  { to: "/admin/analytics", label: "Analytics", icon: () => <BarChart2 className="h-4 w-4" /> },
];
