/**
 * MOCK authentication context (frontend phase).
 * No real credentials are checked. When Laravel Sanctum is connected, replace
 * the bodies of signIn/signOut/register with calls to /auth endpoints and keep
 * this interface unchanged.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { mockFavoriteProductIds, mockUsers, UNIVERSITY_DOMAIN } from "@/lib/mock-data";
import type { User } from "@/types";

const STORAGE_KEY = "campus-exchange.demo-session";

interface AuthContextValue {
  user: User | null;
  hydrated: boolean;
  isAdmin: boolean;
  signIn: (email: string) => User;
  signOut: () => void;
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(mockFavoriteProductIds);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* ignore corrupted demo session */
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    const matched =
      mockUsers.find((u) => u.email.toLowerCase() === normalized) ??
      (normalized.startsWith("admin")
        ? mockUsers.find((u) => u.role === "admin")!
        : mockUsers.find((u) => u.id === 1)!);
    setUser(matched);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
    return matched;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      isAdmin: user?.role === "admin",
      signIn,
      signOut,
      favorites,
      toggleFavorite,
      isFavorite: (id: number) => favorites.includes(id),
    }),
    [user, hydrated, signIn, signOut, favorites, toggleFavorite],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export { UNIVERSITY_DOMAIN };
