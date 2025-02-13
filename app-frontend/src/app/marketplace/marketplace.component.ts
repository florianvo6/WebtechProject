import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ImageService } from '../services/image-service/image.service';
import { MarketitemService } from '../services/marketitem-service/marketitem.service';

@Component({
  selector: 'app-marketplace',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent {
  data: any[] = [];
  owner: string | null = null;
  searchTerm: string = '';

  constructor(private router: Router, private alertService: AlertService, private marketitemService: MarketitemService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getProducts();
  }
 
  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.marketitemService.getMarketItems(this.owner!, false).subscribe(
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

  async filterData (condition: string, handover: string, minPrice: string, maxPrice: string) {
    await this.getProducts();

    try {
        let filteredData = this.data;

        if (condition) {
            filteredData = filteredData.filter(item => condition === item.condition);
        }

        if (handover) {
            filteredData = filteredData.filter(item => handover === item.handover);
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
    await this.getProducts();
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

      this.data = this.data.filter(item =>
          item.title.toLowerCase().includes(normalizedSearchTerm) ||
          item.description.toLowerCase().includes(normalizedSearchTerm) ||
          item.address.toLowerCase().includes(normalizedSearchTerm)
      );
  }

  async resetData(minPriceInput: HTMLInputElement, maxPriceInput: HTMLInputElement, conditionSelect: HTMLSelectElement, handoverSelect: HTMLSelectElement) {
    await this.getProducts();

    minPriceInput.value = '';
    maxPriceInput.value = '';
    conditionSelect.selectedIndex = 0;
    handoverSelect.selectedIndex = 0;
}

  public navigateToAddPage() {
    this.router.navigate(['/add-market-item']);
  }

  public navigateToDetailPage(id: number, url: string) {
    this.router.navigate(['/product-detail', id, url]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}