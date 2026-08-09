"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { setAccessToken } from "@/lib/api/client";
import type { LoginRequest, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<User>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const { accessToken } = await authService.refreshToken();
        setAccessToken(accessToken);
        const me = await authService.me();
        if (!cancelled) setUser(me);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.info("[auth] no active session (this is expected if not logged in)", err);
        }
        setAccessToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    setAccessToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
      queryClient.clear();
      router.push("/login");
    }
  }, [queryClient, router]);

  const refetchUser = useCallback(async () => {
    const me = await authService.me();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout, refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
