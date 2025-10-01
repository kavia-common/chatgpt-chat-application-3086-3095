export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}
