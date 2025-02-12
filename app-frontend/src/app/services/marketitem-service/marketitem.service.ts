import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MarketItem } from '../../models/marketitem';

@Injectable({
  providedIn: 'root'
})
export class MarketitemService {

  private apiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllMarketItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marketitems`, { headers: this.getHeaders() })
  }

  getMarketItems(owner: string, isOwner: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marketitems`, { headers: this.getHeaders() }).pipe(
        map((response: any) => 
            response.filter((product: any) => 
                isOwner ? product.owner === owner : product.owner !== owner && product.sold === false
            )
        )
    );
  }

  getMarketItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marketitem/id?id=${id}`, { headers: this.getHeaders() });
  }

  markItemAsSold(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/marketitem/markassold`, { id: id}, { headers: this.getHeaders() });
  }

  addMarketItem(marketItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-marketitem`, { payload: marketItem }, { headers: this.getHeaders() });
  }

  updateMarketItem(marketItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-marketitem`, { payload: marketItem }, { headers: this.getHeaders() });
  }

  deleteMarketItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-marketitem/${id}`, { headers: this.getHeaders() });
  }

  addImageUrl(imageItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/marketitem/add-image-url`, { payload: imageItem}, { headers: this.getHeaders() });
  }
}
