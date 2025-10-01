import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatLayoutComponent } from './pages/chat-layout/chat-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login - Ocean Chat' },
  { path: 'chat', component: ChatLayoutComponent, title: 'Chat - Ocean Chat' },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
