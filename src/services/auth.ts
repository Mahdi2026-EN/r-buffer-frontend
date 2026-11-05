
import type { User } from "../types";
import { apiRequest } from "./http";

interface BackendUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  credit: number | string;
  createdAt: string;
  lastLoginAt?: string | null;
}

interface LoginResponse {
  token: string;
  user: BackendUser;
}

function mapBackendUser(raw: BackendUser): User {
  const statusMap: Record<string, User["status"]> = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "denied",
    SUSPENDED: "suspended",
  };

  return {
    id: String(raw.id),
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    role: raw.role === "ADMIN" ? "admin" : "user",
    status: statusMap[raw.status] || "pending",
    credit: Number(raw.credit || 0),
    createdAt: raw.createdAt,
    lastLogin: raw.lastLoginAt || undefined,
  };
}

function saveSession(
  token: string,
  user: User,
  remember: boolean,
) {
  // Clear any previous session first.
  localStorage.removeItem("rbuffer_token");
  localStorage.removeItem("rbuffer_user");
  sessionStorage.removeItem("rbuffer_token");
  sessionStorage.removeItem("rbuffer_user");

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem("rbuffer_token", token);
  storage.setItem("rbuffer_user", JSON.stringify(user));
}

export const authService = {
  async login(email: string, password: string, remember = true) {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const user = mapBackendUser(response.user);

    saveSession(response.token, user, remember);

    return {
      token: response.token,
      user,
    };
  },

  async register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const response = await apiRequest<BackendUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return mapBackendUser(response);
  },

  async me() {
    const token = this.getToken();

    if (!token) {
      throw new Error("You are not signed in.");
    }

    const response = await apiRequest<BackendUser>(
      "/users/me",
      { method: "GET" },
      token,
    );

    const user = mapBackendUser(response);

    const storage = localStorage.getItem("rbuffer_token")
      ? localStorage
      : sessionStorage;

    storage.setItem("rbuffer_user", JSON.stringify(user));

    return user;
  },

  getToken() {
    return (
      localStorage.getItem("rbuffer_token") ||
      sessionStorage.getItem("rbuffer_token")
    );
  },

  getCurrentUser(): User | null {
    const stored =
      localStorage.getItem("rbuffer_user") ||
      sessionStorage.getItem("rbuffer_user");

    if (!stored) return null;

    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem("rbuffer_token");
    localStorage.removeItem("rbuffer_user");
    sessionStorage.removeItem("rbuffer_token");
    sessionStorage.removeItem("rbuffer_user");
  },
};
