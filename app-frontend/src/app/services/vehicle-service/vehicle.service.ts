import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://localhost:8000';
    
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllVehicles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicles`, { headers: this.getHeaders() })
  }

  getVehicles(owner: string, isOwner: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicles`, { headers: this.getHeaders() }).pipe(
        map((response: any) => 
            response.filter((vehicle: any) => 
                isOwner ? vehicle.owner === owner : vehicle.owner !== owner && vehicle.sold === false
            )
        )
    );
  }

  getVehicleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicle/id?id=${id}`, { headers: this.getHeaders() });
  }

  markVehicleAsSold(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicle/markassold`, { id: id}, { headers: this.getHeaders() });
  }

  addVehicle(vehicle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-vehicle`, { payload: vehicle }, { headers: this.getHeaders() });
  }

  updateVehicle(vehicleItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-vehicle`, { payload: vehicleItem }, { headers: this.getHeaders() });
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-vehicle/${id}`, { headers: this.getHeaders() });
  }

  addImageUrl(imageItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicle/add-image-url`, { payload: imageItem}, { headers: this.getHeaders() });
  }
}
