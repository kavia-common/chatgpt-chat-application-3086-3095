import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

// PUBLIC_INTERFACE
/** ChatWindowComponent renders active chat messages and a message input composer. */
@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section style="display:flex; flex-direction:column; height:100%;">
      <div class="grad-accent" style="padding:0.75rem 1rem; border-bottom: 1px solid var(--op-border);">
        <div style="font-weight:700; letter-spacing:.02em;">{{ headerTitle() }}</div>
      </div>

      <div style="flex:1; overflow:auto; padding: 1rem;">
        <div *ngIf="!activeId(); else messagesTpl" class="surface" style="padding: 2rem; text-align:center;">
          <div style="font-weight:700; font-size:1.1rem;">No chat selected</div>
          <div style="color:var(--op-muted); margin-top:.3rem;">Choose or create a chat from the sidebar.</div>
        </div>

        <ng-template #messagesTpl>
          <div style="display:flex; flex-direction:column; gap:.6rem;">
            <div *ngFor="let m of msgs()" [class]="m.senderId === myId ? 'chat-bubble me' : 'chat-bubble other'"
                 [style.align-self]="m.senderId === myId ? 'flex-end' : 'flex-start'">
              <div style="font-size:.8rem; color:var(--op-muted)" *ngIf="m.senderId !== myId">{{ m.senderName || 'Assistant' }}</div>
              <div [innerText]="m.content"></div>
              <div style="font-size:.75rem; color:var(--op-muted); margin-top:.25rem;">{{ m.createdAt | date:'shortTime' }}</div>
            </div>
          </div>
        </ng-template>
      </div>

      <div style="border-top:1px solid var(--op-border); padding:.8rem; background:var(--op-surface);">
        <form (submit)="send($event)" style="display:flex; gap:.6rem;">
          <textarea class="input" rows="2" placeholder="Type a message..." [(ngModel)]="draft" name="draft"
            style="resize: vertical; min-height:44px;"></textarea>
          <button class="btn" [disabled]="!activeId() || !draft.trim()">Send</button>
        </form>
      </div>
    </section>
  `
})
export class ChatWindowComponent implements OnInit {
  private chat = inject(ChatService);
  myId = 'me'; // placeholder; replace with actual user id via AuthService when available

  activeId = this.chat.activeChatId;
  headerTitle = computed(() => {
    const id = this.activeId();
    if (!id) return 'Ocean Chat';
    const c = this.chat.chats().find(x => x.id === id);
    return c?.title || 'Conversation';
  });

  msgs = computed(() => {
    const id = this.activeId();
    if (!id) return [];
    const map = this.chat.messages();
    return map[id] || [];
  });

  draft = '';

  async ngOnInit() {
    this.chat.connect();
  }

  async send(ev: any) {
    ev.preventDefault();
    const id = this.activeId();
    const text = this.draft.trim();
    if (!id || !text) return;
    await this.chat.sendMessage({ chatId: id, content: text });
    this.draft = '';
  }
}
