import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

// PUBLIC_INTERFACE
/** SidebarComponent lists chats and allows selecting or creating a chat. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="surface" style="width:320px; height:100%; display:flex; flex-direction:column; overflow:hidden;">
      <div style="padding:0.75rem; border-bottom:1px solid var(--op-border);">
        <div style="display:flex; gap:.5rem;">
          <input class="input" placeholder="Search chats..." [(ngModel)]="query">
          <button class="btn" (click)="create()">New</button>
        </div>
      </div>
      <div style="flex:1; overflow:auto; padding:.5rem;">
        <div *ngFor="let c of filtered()"
             (click)="open(c.id)"
             [style.background]="c.id===activeId() ? 'linear-gradient(135deg, rgba(37,99,235,0.08), #fff)' : '#fff'"
             style="border:1px solid var(--op-border); border-radius:12px; padding:.6rem .7rem; margin:.4rem 0; cursor:pointer; box-shadow: var(--op-shadow);">
          <div style="font-weight:600; margin-bottom:.2rem;">{{ c.title }}</div>
          <div style="font-size:.85rem; color:var(--op-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            {{ c.lastMessage || 'Start the conversation...' }}
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  private chat = inject(ChatService);
  query = '';
  activeId = this.chat.activeChatId;
  list = this.chat.chats;

  filtered = computed(() => {
    const q = this.query.toLowerCase();
    return this.list().filter(c => c.title.toLowerCase().includes(q));
  });

  async ngOnInit() {
    await this.chat.refreshChats();
  }

  open(id: string) {
    this.chat.loadMessages(id);
  }

  async create() {
    await this.chat.createChat({});
  }
}
