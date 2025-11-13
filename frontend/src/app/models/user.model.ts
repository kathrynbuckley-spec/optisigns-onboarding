export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  hasCompletedQuestionnaire?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
