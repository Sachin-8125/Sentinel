import type {
  User,
  AuthResponse,
  HealthReading,
  Alert,
  SystemReading,
} from "../types";

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

  //Health Reading
  async addHealthReading(
    reading: Omit<HealthReading, "id" | "userId" | "timestamp">,
  ): Promise<any> {
    return this.request("/api/health/readings", {
      method: "POST",
      body: JSON.stringify(reading),
    });
  }

  async getHealthReadings(limit = 50): Promise<{ readings: HealthReading[] }> {
    return this.request<{ readings: HealthReading[] }>(
      `/api/health/readings?limit=${limit}`,
    );
  }

  async getLatestVitals(): Promise<{ vitals: HealthReading }> {
    return this.request<{ vitals: HealthReading }>("/api/health/vitals");
  }

  async getHealthHistory(hours = 24): Promise<{ readings: HealthReading[] }> {
    return this.request<{ readings: HealthReading[] }>(
      `/api/health/history?hours=${hours}`,
    );
  }

  //System Reading
  async addSystemReading(
    reading: Omit<SystemReading, "id" | "userId" | "timestamp">,
  ): Promise<any> {
    return this.request("/api/system/readings", {
      method: "POST",
      body: JSON.stringify(reading),
    });
  }

  async getSystemReadings(limit = 50): Promise<{ readings: SystemReading[] }> {
    return this.request<{ readings: SystemReading[] }>(
      `/api/system/readings?limit=${limit}`,
    );
  }

  async getSystemStatus(): Promise<{ status: SystemReading }> {
    return this.request<{ status: SystemReading }>("/api/system/status");
  }

  //Alerts
  async getActiveAlerts(): Promise<{ alerts: Alert[] }> {
    return this.request<{ alerts: Alert[] }>("/api/system/alerts");
  }

  async getAllAlerts(limit = 100): Promise<{ alerts: Alert[] }> {
    return this.request<{ alerts: Alert[] }>(
      `/api/system/alerts/all?limit=${limit}`,
    );
  }

  async resolveAlert(alertId: string): Promise<{ alert: Alert }> {
    return this.request<{ alert: Alert }>(
      `/api/system/alerts/${alertId}/resolve`,
      {
        method: "PATCH",
      },
    );
  }
}
export const api = new ApiClient();
