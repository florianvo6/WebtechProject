import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MarketItem } from '../../models/marketitem';

@Injectable({
  providedIn: 'root'
})
export class MarketitemService {

  private apiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }

  getAllMarketItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marketitems`)
  }

  getMarketItems(owner: string, isOwner: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marketitems`).pipe(
        map((response: any) => 
            response.filter((product: any) => 
                isOwner ? product.owner === owner : product.owner !== owner && product.sold === false
            )
        )
    );
  }

  getMarketItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marketitem/id?id=${id}`);
  }

  markItemAsSold(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/marketitem/markassold`, { id: id});
  }

  addMarketItem(marketItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-marketitem`, { payload: marketItem });
  }

  updateMarketItem(marketItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-marketitem`, { payload: marketItem });
  }

  deleteMarketItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-marketitem/${id}`);
  }

  addImageUrl(imageItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/marketitem/add-image-url`, { payload: imageItem});
  }
}
