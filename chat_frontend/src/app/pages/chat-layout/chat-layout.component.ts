import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
/** ChatLayoutComponent composes the chat experience with topbar, sidebar and chat window. */
@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent, SidebarComponent, ChatWindowComponent],
  template: `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <app-topbar />
      <div style="display:flex; gap:1rem; padding:1rem; height: calc(100vh - 64px);">
        <app-sidebar />
        <main class="surface" style="flex:1; overflow:hidden;">
          <app-chat-window />
        </main>
      </div>
    </div>
  `
})
export class ChatLayoutComponent {}
