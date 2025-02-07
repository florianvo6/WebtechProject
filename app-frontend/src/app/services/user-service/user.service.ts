import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<any> {
    console.log(username);
    return this.http.post<any>(`${this.apiUrl}/user/username`, { login: username });
  }
}