import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// PUBLIC_INTERFACE
/** LoginComponent presents a modern themed login form and handles authentication. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh; display:grid; place-items:center; background: radial-gradient(1200px 500px at 10% -10%, rgba(37,99,235,.08), transparent), radial-gradient(1200px 500px at 90% 110%, rgba(245,158,11,.08), transparent)">
      <div class="surface" style="width:100%; max-width: 420px; padding:1.25rem;">
        <div style="display:flex; align-items:center; gap:.6rem; margin-bottom:1rem;">
          <div style="width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, rgba(37,99,235,.18), rgba(37,99,235,.06)); color:var(--op-primary); font-weight:800;">OC</div>
          <div>
            <div style="font-size:1.1rem; font-weight:800;">Ocean Chat</div>
            <div style="font-size:.85rem; color:var(--op-muted)">Sign in to continue</div>
          </div>
        </div>
        <form (submit)="login($event)" style="display:flex; flex-direction:column; gap:.75rem;">
          <div>
            <label style="display:block; font-size:.85rem; color:var(--op-muted); margin-bottom:.25rem;">Email</label>
            <input class="input" name="email" type="email" [(ngModel)]="email" placeholder="you@example.com" required>
          </div>
          <div>
            <label style="display:block; font-size:.85rem; color:var(--op-muted); margin-bottom:.25rem;">Password</label>
            <input class="input" name="password" type="password" [(ngModel)]="password" placeholder="********" required>
          </div>
          <button class="btn" [disabled]="loading()">{{ loading() ? 'Signing in...' : 'Sign in' }}</button>
          <div *ngIf="error()" style="color:var(--op-error); font-size:.9rem; text-align:center; margin-top:.25rem;">
            {{ error() }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async login(ev: any) {
    ev.preventDefault();
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.auth.login({ email: this.email, password: this.password });
      await this.auth.loadProfile();
      this.router.navigateByUrl('/chat');
    } catch (e: any) {
      this.error.set(e?.message || 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }
}
