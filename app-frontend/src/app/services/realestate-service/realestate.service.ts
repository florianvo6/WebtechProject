import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealestateService {

  private apiUrl = 'http://localhost:8000';
      
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllRealEstate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/realestate`, { headers: this.getHeaders() })
  }

  getRealEstate(owner: string, isOwner: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/realestate`, { headers: this.getHeaders() }).pipe(
        map((response: any) => 
            response.filter((realestate: any) => 
                isOwner ? realestate.owner === owner : realestate.owner !== owner && realestate.sold === false
            )
        )
    );
  }

  getRealestateById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/realestate/id?id=${id}`, { headers: this.getHeaders() });
  }

  markRealestateAsSold(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/realestate/markassold`, { id: id}, { headers: this.getHeaders() });
  }

  addRealestate(realestate: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-realestate`, { payload: realestate }, { headers: this.getHeaders() });
  }

  updateRealestate(realestateItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-realestate`, { payload: realestateItem }, { headers: this.getHeaders() });
  }

  deleteRealestate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-realestate/${id}`, { headers: this.getHeaders() });
  }

  addImageUrl(imageItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/realestate/add-image-url`, { payload: imageItem}, { headers: this.getHeaders() });
  }
}
