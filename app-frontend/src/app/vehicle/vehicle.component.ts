import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertService } from '../services/alert-service/alert.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImageService } from '../services/image-service/image.service';
import { VehicleService } from '../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-vehicle',
  imports: [CommonModule, AlertComponent, NavbarComponent, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {
  data: any[] = [];
  owner: string | null = null;
  searchTerm: string = '';

  constructor(private router: Router, private alertService: AlertService, private vehicleService: VehicleService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getVehicles();
  }

  getVehicles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleService.getVehicles(this.owner!, false).subscribe(
          (data: any) => {
              this.data = data;
              resolve();
          },
          (error) => {
              console.error('Error fetching products:', error);
              reject(error);
          }
      );
    });
  }

  async filterData (brand: string, initialapproval: string, minPrice: string, maxPrice: string) {
    await this.getVehicles();

    try {
        const initialApprovalNumber = initialapproval ? +initialapproval : null;
        let filteredData = this.data;

        if (brand) {
            filteredData = filteredData.filter(item => brand === item.brand);
        }

        if (initialApprovalNumber) {
            filteredData = filteredData.filter(item => initialApprovalNumber === item.initialapproval);
        }

        const minPriceValue = minPrice ? parseFloat(minPrice) : null;
        const maxPriceValue = maxPrice ? parseFloat(maxPrice) : null;

        if (minPriceValue !== null && !isNaN(minPriceValue)) {
            filteredData = filteredData.filter(item => item.price >= minPriceValue);
        }

        if (maxPriceValue !== null && !isNaN(maxPriceValue)) {
          filteredData = filteredData.filter(item => item.price <= maxPriceValue);
        }

        this.data = filteredData;
    } catch (error) {
        console.error(error);
    }
  }

  async searchData () {
    await this.getVehicles();
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

        this.data = this.data.filter(item =>
            item.title.toLowerCase().includes(normalizedSearchTerm) ||
            item.description.toLowerCase().includes(normalizedSearchTerm) ||
            item.address.toLowerCase().includes(normalizedSearchTerm)
        );
  }

  async resetData(brandSelect: HTMLSelectElement, initialapprovalSelect: HTMLSelectElement, minPriceInput: HTMLInputElement, maxPriceInput: HTMLInputElement) {
    await this.getVehicles();

    minPriceInput.value = '';
    maxPriceInput.value = '';
    brandSelect.selectedIndex = 0;
    initialapprovalSelect.selectedIndex = 0;
}

  public navigateToAddPage() {
    this.router.navigate(['/add-vehicle']);
  }

  public navigateToDetailPage(id: number, url: string) {
    this.router.navigate(['/vehicle-detail', id, url]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}