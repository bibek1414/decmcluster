export interface User {
  username: string;
  email?: string;
  role: string;
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
  username?: string;
  role?: string;
  email?: string;
}
