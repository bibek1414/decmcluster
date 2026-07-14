export interface User {
  email: string;
  role: string;
  access_control?: string[];
}

export interface LoginRequest {
  email: string;
  password?: string;
  role?: string;
}

export interface LoginResponse {
  token?: string;
  key?: string;
  access?: string;
  user?: User;
  role?: string;
  email?: string;
  access_control?: string[];
}
