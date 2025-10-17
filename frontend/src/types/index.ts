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

export interface HealthReading {
  id: string;
  userId: string;
  heartRate: number;
  sp02: number;
  systolicBP: number;
  diastolicBP: number;
  skinTemp: number;
  respiratoryRate?: number;
  timestamp: string;
}

export interface SystemReading {
  id: string;
  userId: string;
  cabinCO2: number;
  cabinO2: number;
  cabinPressure: number;
  cabinTemp: number;
  cabinHumidity: number;
  powerConsumption: number;
  waterReclamationLevel: number;
  wasteManagementLevel: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  userId?: string;
  type: "CRITICAL" | "WARNING" | "INFO";
  category: "HEALTH" | "SYSTEM" | "ENVIRONMENT";
  title: string;
  message: string;
  recommendation: string;
  resolved: boolean;
  timestamp: string;
  resolvedAt?: string;
}
