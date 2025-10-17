export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
