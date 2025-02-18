import { Component } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Create } from '../models/vehicle';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../models/alert-type';
import { createRealestateItem, RealEstateItem } from '../models/realestateitem';
import { AlertService } from '../services/alert-service/alert.service';
import { RealestateService } from '../services/realestate-service/realestate.service';

@Component({
  selector: 'app-update-real-estate',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './update-real-estate.component.html',
  styleUrl: './update-real-estate.component.css'
})
export class UpdateRealEstateComponent {
  id: number | undefined;
  realestateItem: RealEstateItem = createRealestateItem();
  alert: Alert | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private alertService: AlertService, private realestateService: RealestateService) { }

  async ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.realestateItem.seller.owner = storedUsername;
    }

    if (storedName) {
        this.realestateItem.seller.name = storedName;
    }

    if (storedAddress) {
      this.realestateItem.seller.address = storedAddress;
    }

    this.route.params.subscribe(async (params) => {
      this.id = +params['id'];
    });

    await this.getRealEstate(this.id!);
  }

  getRealEstate(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.realestateService.getRealestateById(id).subscribe(
        (response) => {
          this.realestateItem = response;
          console.info(this.realestateItem);
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
      title: this.realestateItem.title,
      description: this.realestateItem.description,
      price: this.realestateItem.price,
      type: this.realestateItem.type,
      selltype: this.realestateItem.selltype,
      size: this.realestateItem.size,
      rooms: this.realestateItem.rooms,
      id: this.id,
    };

    console.info(payload);

    this.realestateService.updateRealestate(payload).subscribe(
        (response: any) => {
            if (response && response.message) {
                this.alertService.success('Real estate item updated successfully!');
            } else {
                this.alertService.error('Failed to update real estate item. Please try again.');
            }
        },
        (error) => {
            this.alertService.error("Failed to update real estate item! " + error.error.message + " Please try again.");
            console.error('Error response:', error);
        }
    );
  }

  goToProfil() {
    this.router.navigate(['/profile']);
  }
}
