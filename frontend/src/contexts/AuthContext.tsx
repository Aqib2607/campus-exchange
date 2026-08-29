import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UNIVERSITY_DOMAIN } from "@/lib/constants";
import type { User } from "@/types";
import { api } from "@/services/api";

const STORAGE_KEY = "campus-exchange.session_user";

interface AuthContextValue {
  user: User | null;
  hydrated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<User>;
  registerUser: (data: any) => Promise<User>;
  signOut: () => Promise<void>;
  favorites: number[];
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await api.auth.me();
          setUser(userData);
          
          try {
            const favs = await api.favorites.list();
            setFavorites(favs.map((f: any) => f.product_id));
          } catch {
            setFavorites([]);
          }
        }
      } catch {
        localStorage.removeItem('auth_token');
        queryClient.clear();
        setUser(null);
        setFavorites([]);
      } finally {
        setHydrated(true);
      }
    };
    initAuth();
  }, [queryClient]);

  const signIn = useCallback(async (email: string, password?: string) => {
    queryClient.clear();
    const res = await api.auth.login({ email, password: password || 'password' });
    localStorage.setItem('auth_token', res.data.token);
    setUser(res.data.user);
    
    try {
      const favs = await api.favorites.list();
      setFavorites(favs.map((f: any) => f.product_id));
    } catch {
      setFavorites([]);
    }
    
    return res.data.user;
  }, [queryClient]);

  const registerUser = useCallback(async (data: any) => {
    queryClient.clear();
    const res = await api.auth.register(data);
    localStorage.setItem('auth_token', res.data.token);
    setUser(res.data.user);
    setFavorites([]);
    return res.data.user;
  }, [queryClient]);

  const signOut = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('auth_token');
      await queryClient.cancelQueries();
      queryClient.clear();
      setUser(null);
      setFavorites([]);
    }
  }, [queryClient]);

  const toggleFavorite = useCallback(async (productId: number) => {
    const isFav = favorites.includes(productId);
    try {
      if (isFav) {
        setFavorites((prev) => prev.filter((id) => id !== productId));
        await api.favorites.remove(productId);
      } else {
        setFavorites((prev) => [...prev, productId]);
        await api.favorites.add(productId);
      }
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (e) {
      // Revert optimistic update
      if (isFav) setFavorites((prev) => [...prev, productId]);
      else setFavorites((prev) => prev.filter((id) => id !== productId));
    }
  }, [favorites, queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      isAdmin: user?.role === "admin",
      signIn,
      registerUser,
      signOut,
      favorites,
      toggleFavorite,
      isFavorite: (id: number) => favorites.includes(id),
    }),
    [user, hydrated, signIn, registerUser, signOut, favorites, toggleFavorite],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export { UNIVERSITY_DOMAIN };
