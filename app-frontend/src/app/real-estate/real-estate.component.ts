import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ImageService } from '../services/image-service/image.service';
import { RealestateService } from '../services/realestate-service/realestate.service';

@Component({
  selector: 'app-real-estate',
  imports: [CommonModule, AlertComponent, NavbarComponent, FormsModule],
  templateUrl: './real-estate.component.html',
  styleUrl: './real-estate.component.css'
})
export class RealEstateComponent {
  data: any[] = [];
  owner: string | null = null;
  searchTerm: string = '';

  constructor(private router: Router, private alertService: AlertService, private realestateService: RealestateService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getRealEstate();
  }

  getRealEstate(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.realestateService.getRealEstate(this.owner!, false).subscribe(
            (data: any) => {
                this.data = data;
                resolve();
            },
            (error) => {
                console.error('Error fetching real estate items:', error);
                reject(error);
            }
        );
    });
  }

  async filterData (type: string, selltype: string, minPrice: string, maxPrice: string) {
    await this.getRealEstate();

    try {
        let filteredData = this.data;

        if (type) {
            filteredData = filteredData.filter(item => type === item.type);
        }

        if (selltype) {
            filteredData = filteredData.filter(item => selltype === item.selltype);
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
    await this.getRealEstate();
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

        this.data = this.data.filter(item =>
            item.title.toLowerCase().includes(normalizedSearchTerm) ||
            item.description.toLowerCase().includes(normalizedSearchTerm) ||
            item.address.toLowerCase().includes(normalizedSearchTerm)
        );
  }

  async resetData(typeSelect: HTMLSelectElement, selltypeSelect: HTMLSelectElement, minPriceInput: HTMLInputElement, maxPriceInput: HTMLInputElement) {
    await this.getRealEstate();

    minPriceInput.value = '';
    maxPriceInput.value = '';
    typeSelect.selectedIndex = 0;
    selltypeSelect.selectedIndex = 0;
  }

  public navigateToAddPage() {
    this.router.navigate(['/add-real-estate-item']);
  }

  public navigateToDetailPage(id: number, url: string) {
    this.router.navigate(['/real-estate-detail', id, url]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}