import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealestateService {

  private apiUrl = 'http://localhost:8000';
      
  constructor(private http: HttpClient) { }

  getRealEstate(owner: string, isOwner: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/realestate`).pipe(
        map((response: any) => 
            response.filter((realestate: any) => 
                isOwner ? realestate.owner === owner : realestate.owner !== owner
            )
        )
    );
  }

  getRealestateById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/realestate/id?id=${id}`);
  }

  addRealestate(realestate: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-realestate`, { payload: realestate });
  }

  updateRealestate(realestateItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-realestate`, { payload: realestateItem });
  }

  deleteRealestate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-realestate/${id}`);
  }
}
