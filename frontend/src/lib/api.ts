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
  async signup(){

  }

export const api = new ApiClient();
