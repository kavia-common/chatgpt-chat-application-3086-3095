/* global localStorage:readonly, Headers:readonly, Response:readonly, URL:readonly, window:readonly, fetch:readonly */
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// PUBLIC_INTERFACE
/**
 * ApiService is a lightweight HTTP client that manages auth token and JSON requests.
 * It reads base URLs from environment and exposes typed helpers for GET/POST/PUT/DELETE.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private router = inject(Router);
  private tokenKey = 'auth_token';

  get apiBase() {
    return environment.apiBaseUrl.replace(/\/+$/, '');
  }

  // PUBLIC_INTERFACE
  /** Set current JWT or bearer token for authenticated requests. */
  setToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // PUBLIC_INTERFACE
  /** Clear token and navigate to login. */
  clearToken() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigateByUrl('/login');
  }

  // PUBLIC_INTERFACE
  /** Retrieve token from localStorage. */
  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private headers(extra?: Record<string, string>): Headers {
    const h = new Headers({ 'Content-Type': 'application/json', ...(extra || {}) });
    const t = this.getToken();
    if (t) h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private async handle(res: Response) {
    if (!res.ok) {
      if (res.status === 401) this.clearToken();
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }

  // PUBLIC_INTERFACE
  /** GET JSON helper */
  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const base = this.apiBase + path;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const url = new URL(base, origin);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    const res = await fetch(url.toString(), { method: 'GET', headers: this.headers() });
    return this.handle(res) as Promise<T>;
  }

  // PUBLIC_INTERFACE
  /** POST JSON helper */
  async post<T>(path: string, body?: any): Promise<T> {
    const res = await fetch(this.apiBase + path, { method: 'POST', headers: this.headers(), body: body ? JSON.stringify(body) : undefined });
    return this.handle(res) as Promise<T>;
  }

  // PUBLIC_INTERFACE
  /** PUT JSON helper */
  async put<T>(path: string, body?: any): Promise<T> {
    const res = await fetch(this.apiBase + path, { method: 'PUT', headers: this.headers(), body: body ? JSON.stringify(body) : undefined });
    return this.handle(res) as Promise<T>;
  }

  // PUBLIC_INTERFACE
  /** DELETE JSON helper */
  async delete<T>(path: string): Promise<T> {
    const res = await fetch(this.apiBase + path, { method: 'DELETE', headers: this.headers() });
    return this.handle(res) as Promise<T>;
  }
}
