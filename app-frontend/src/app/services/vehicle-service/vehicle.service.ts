import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://localhost:8000';
    
  constructor(private http: HttpClient) { }

  getVehicles(owner: string, isOwner: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicles`).pipe(
        map((response: any) => 
            response.filter((vehicle: any) => 
                isOwner ? vehicle.owner === owner : vehicle.owner !== owner
            )
        )
    );
  }

  getVehicleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicle/id?id=${id}`);
  }

  addVehicle(vehicle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-vehicle`, { payload: vehicle });
  }

  updateVehicle(vehicleItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-vehicle`, { payload: vehicleItem });
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-vehicle/${id}`);
  }
}
