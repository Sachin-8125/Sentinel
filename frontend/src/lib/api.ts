import type { User, AuthResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }
    return response.json();
  }

  //Auth
  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", { method: "POST" });
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/api/auth/me");
  }
}
export const api = new ApiClient();
