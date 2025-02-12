import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserChats(recipient: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/chats/${recipient}`, { headers: this.getHeaders() });
  }

  getChatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/id?id=${id}`, { headers: this.getHeaders() });
  }

  addChat(chat: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-chat`, { payload: chat }, { headers: this.getHeaders() });
  }

  deleteChatById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-chat/${id}`, { headers: this.getHeaders() });
  }

  getMessagesById(chatId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages/chatId?id=${chatId}`, { headers: this.getHeaders() });
  }

  addMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-message`, { payload: message }, { headers: this.getHeaders() });
  }
}
