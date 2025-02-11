import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }

  getUserChats(recipient: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/chats/${recipient}`);
  }

  getChatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/id?id=${id}`);
  }

  addChat(chat: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-chat`, { payload: chat });
  }

  deleteChatById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-chat/${id}`);
  }

  getMessagesById(chatId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages/chatId?id=${chatId}`);
  }

  addMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-message`, { payload: message });
  }
}
