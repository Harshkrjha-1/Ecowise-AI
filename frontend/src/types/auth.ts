export type UserRole = 'student' | 'admin' | 'sustainability_manager';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
  eco_points: number;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  department?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
