import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

// PUBLIC_INTERFACE
/** TopbarComponent displays user info and settings/logout actions. */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar-blur" style="position: sticky; top:0; z-index:50;">
      <div style="display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem;">
        <div style="flex:1; display:flex; align-items:center; gap:.75rem;">
          <div style="width:34px;height:34px;border-radius:12px;background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(37,99,235,0.06)); display:flex; align-items:center; justify-content:center; color:var(--op-primary); font-weight:700;">
            OC
          </div>
          <div style="font-weight:700; letter-spacing:.02em;">Ocean Chat</div>
        </div>
        <div style="display:flex; align-items:center; gap:.5rem;">
          <div style="text-align:right;">
            <div style="font-weight:600">{{ user()?.name || 'Guest' }}</div>
            <div style="font-size:.8rem; color:var(--op-muted)">{{ user()?.email }}</div>
          </div>
          <img *ngIf="user()?.avatarUrl" [src]="user()?.avatarUrl" alt="avatar"
               style="width:36px;height:36px;border-radius:12px;border:1px solid var(--op-border)" />
          <button class="btn btn-ghost" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent {
  private auth = inject(AuthService);
  user = computed(() => this.auth.user());

  logout() {
    this.auth.logout();
  }
}
