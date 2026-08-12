import { apiClient, refreshAccessToken } from "@/lib/api/client";
import type { LoginRequest, LoginResponseData, UpdateProfileRequest, User } from "@/types";

export const authService = {
  // data: { user, accessToken }
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponseData>("/auth/login", payload, { skipAuth: true }),

  // Delegates to the single shared refresh function in lib/api/client.ts
  // (also used internally for automatic 401 retries) so a bootstrap call
  // from AuthProvider and a concurrent 401-triggered refresh from any other
  // in-flight request always share ONE in-flight network call rather than
  // racing two separate refresh-token requests.
  refreshToken: async () => {
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw new Error("Unable to refresh session");
    }
    return { accessToken };
  },

  logout: () => apiClient.post<null>("/auth/logout"),

  // data: { user } — NOT data itself
  me: async () => {
    const data = await apiClient.get<{ user: User }>("/auth/me");
    return data.user;
  },

  // data: { user }
  updateMe: async (payload: UpdateProfileRequest) => {
    const data = await apiClient.patch<{ user: User }>("/auth/me", payload);
    return data.user;
  },
};
