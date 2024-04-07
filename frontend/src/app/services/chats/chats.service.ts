import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import chat from './chat';
import { status } from '../status';
import user from '../users/user';

interface getChatsUser extends status {
  data: user[];
}

interface getChats extends status {
  data: chat[];
}

interface postChat extends status {
  resource: string;
}

interface getOneChat extends status {
  data: chat;
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  chatUrl = 'http://localhost:3000/chats';

  constructor(private http: HttpClient) {}

  getChatsOfUser(id: string) {
    return this.http.get<getChatsUser>(`${this.chatUrl}/${id}`).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  getChats(involved: string[]) {
    return this.http
      .get<getChats>(`${this.chatUrl}/?involved=${involved.toString()}`)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  postChat(newChat: chat) {
    return this.http.post<postChat>(`${this.chatUrl}/new`, newChat).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  getOneChat(id: string) {
    return this.http.get<getOneChat>(`${this.chatUrl}/one/${id}`).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }
}
