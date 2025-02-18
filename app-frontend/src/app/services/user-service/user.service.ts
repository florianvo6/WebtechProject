import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserByUsername(login: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${login}`, { headers: this.getHeaders() });
  }

  changeUserSetting(settings: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/change`, { payload: settings}, { headers: this.getHeaders() });
  }
}