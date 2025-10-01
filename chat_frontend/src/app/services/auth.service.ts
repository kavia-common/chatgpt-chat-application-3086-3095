import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, UserProfile } from '../models/auth.models';

// PUBLIC_INTERFACE
/** AuthService handles login/logout and exposes a reactive user profile signal. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<UserProfile | null>(null);

  constructor(private api: ApiService) {}

  // PUBLIC_INTERFACE
  /** Attempt to login with email/password. Sets token and profile on success. */
  async login(payload: LoginRequest) {
    const res = await this.api.post<LoginResponse>('/auth/login', payload);
    this.api.setToken(res.accessToken);
    const profile: UserProfile = {
      id: res.user.id,
      email: res.user.email,
      name: res.user.name || res.user.email.split('@')[0],
      avatarUrl: res.user.avatarUrl
    };
    this.user.set(profile);
    return profile;
  }

  // PUBLIC_INTERFACE
  /** Load profile using the current token. */
  async loadProfile() {
    try {
      const me = await this.api.get<UserProfile>('/auth/me');
      this.user.set(me);
      return me;
    } catch {
      this.logout();
      return null;
    }
  }

  // PUBLIC_INTERFACE
  /** Log out and clear token. */
  logout() {
    this.user.set(null);
    this.api.clearToken();
  }
}
