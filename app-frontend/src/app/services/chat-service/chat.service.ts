import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }

  addChat(chat: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-chat`, { payload: chat });
  }

  addMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-message`, { payload: message });
  }
}
