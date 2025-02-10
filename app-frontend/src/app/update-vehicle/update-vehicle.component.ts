import { Component } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Create, VehicleItem } from '../models/vehicle';
import { Alert } from '../models/alert-type';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { VehicleService } from '../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-update-vehicle',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './update-vehicle.component.html',
  styleUrl: './update-vehicle.component.css'
})
export class UpdateVehicleComponent {
  id: number | undefined;
  vehicleItem: VehicleItem = Create();
  alert: Alert | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private alertService: AlertService, private vehicleService: VehicleService) { }

  async ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.vehicleItem.seller.owner = storedUsername;
    }

    if (storedName) {
        this.vehicleItem.seller.name = storedName;
    }

    if (storedAddress) {
      this.vehicleItem.seller.address = storedAddress;
    }

    this.route.params.subscribe(async (params) => {
      this.id = +params['id'];
    });

    await this.getVehicle(this.id!);
  }

  getVehicle(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.vehicleService.getVehicleById(id).subscribe(
        (response) => {
          this.vehicleItem = response;
          console.info(this.vehicleItem);
          resolve(); 
        },
        (error) => {
          this.alertService.error("Error: " + error.message)
          reject(error);
        }
      );
    });
  }

  async onUpdate(): Promise<void> {
    const payload = {
      title: this.vehicleItem.title,
      description: this.vehicleItem.description,
      price: this.vehicleItem.price,
      brand: this.vehicleItem.brand,
      mileage: this.vehicleItem.mileage,
      initialapproval: this.vehicleItem.initialapproval,
      id: this.id,
    };

    console.info(payload);

    this.vehicleService.updateVehicle(payload).subscribe(
        (response: any) => {
            if (response && response.message) {
                this.alertService.success('Vehicle updated successfully!');
            } else {
                this.alertService.error('Failed to update vehicle. Please try again.');
            }
        },
        (error) => {
            this.alertService.error("Failed to update vehicle! " + error.error.message + " Please try again.");
            console.error('Error response:', error);
        }
    );
  }

  goToProfil() {
    this.router.navigate(['/profile']);
  }
}
