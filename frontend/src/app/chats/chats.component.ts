import {
  Component,
  ElementRef,
  Inject,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { ChatsService } from '../services/chats/chats.service';
import chat from '../services/chats/chat';
import { UsersService } from '../services/users/users.service';
import user from '../services/users/user';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';

// global.WebSocket = require('ws');

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
})
export class ChatsComponent {
  sessionStorageService = inject(SessionStorageService);
  usersService = inject(UsersService);
  chatsService = inject(ChatsService);
  userId: string | null = null;
  user: Partial<user> = {};
  wsSubject: Partial<
    WebSocketSubject<
      chat & {
        fromId: string;
        toId: string;
      }
    >
  > = {};
  chats: user[] = [];
  talkingTo: number = -1;
  messages: chat[] = [];
  inputMessage = new FormControl('');

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.userId = this.sessionStorageService.getItem('id');

    if (this.userId)
      this.usersService.getUser(this.userId).subscribe((response) => {
        this.user = { ...response.data };
      });

    if (
      this.userId &&
      this.document.defaultView &&
      this.document.defaultView.sessionStorage
    )
      this.wsSubject = webSocket(`ws://localhost:8080/?userid=${this.userId}`);

    if (this.userId)
      this.chatsService.getChatsOfUser(this.userId).subscribe((response) => {
        this.chats = [...response.data];
      });

    if (this.document.defaultView)
      if (this.document.defaultView.sessionStorage) {
        console.log('setting ws');
        this.wsSubject.subscribe!({
          next: (msg) => {
            console.log(msg);

            if (msg.fromId == this.chats[this.talkingTo]._id) {
              this.messages.push({
                _id: msg._id!,
                emisor: msg.emisor,
                receiver: msg.receiver,
                message: msg.message,
                createdAt: msg.createdAt,
              });
            }
          },
          error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
          complete: () => console.log('complete'), // Called when connection is closed (for whatever reason).
        });
      }
  }

  @ViewChildren('userChats') userChats?: QueryList<ElementRef>;
  getSelectedChatIndex(event: Event, allChats: HTMLUListElement) {
    const index = Array.from(allChats.children).findIndex(
      (element) => element == event.target
    );

    this.loadChat(index);
  }

  loadChat(index: number) {
    if (index < 0) return;

    // this.talkingTo = this.chats[index].username;
    this.talkingTo = index;

    const involved = [this.user.username!, this.chats[index].username];
    this.chatsService.getChats(involved).subscribe((response) => {
      this.messages = [...response.data];
    });
  }

  ngOnDestroy() {
    if (this.wsSubject.complete) this.wsSubject.complete();
  }

  sendMessage() {
    if (this.inputMessage.value && this.user.username && this.talkingTo >= 0)
      this.chatsService
        .postChat({
          emisor: this.user.username,
          receiver: this.chats[this.talkingTo].username,
          message: this.inputMessage.value,
        })
        .subscribe((response) => {
          this.chatsService
            .getOneChat(response.resource.split('/')[1])
            .subscribe((response) => {
              this.messages.push({
                ...response.data,
              });

              if (this.wsSubject && this.userId && this.wsSubject.next) {
                this.wsSubject.next({
                  _id: response.data._id,
                  emisor: this.user.username!,
                  receiver: this.chats[this.talkingTo].username,
                  fromId: this.userId,
                  toId: this.chats[this.talkingTo]._id,
                  message: this.inputMessage.value!,
                });
              }
            });
        });
    // this.wsSubject.next({ message: msg });
  }
}
