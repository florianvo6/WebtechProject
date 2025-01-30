import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getProducts();
  }
 
  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/products').subscribe(
        (response: any) => {
          // Filter products based on owner
          this.data = response.filter((product: any) => product.owner !== this.owner);
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  }

  async filterData (condition: string, handover: string) {
    await this.getProducts();

    try {
      if (condition && !handover) {
        this.data = this.data.filter(item => condition === item.condition);
      }
      else if (!condition && handover) {
        this.data = this.data.filter(item => handover === item.handover);
      }
      else if (condition && handover) {
        this.data = this.data.filter(item => condition === item.condition && handover === item.handover);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async searchData () {
    await this.getProducts();
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

        this.data = this.data.filter(item =>
            item.title.toLowerCase().includes(normalizedSearchTerm)
        );
  }

  async resetData() {
    this.getProducts();
  }

  public navigateToAddPage() {
    this.router.navigate(['/add-market-item']);
  }

  public navigateToDetailPage(id: number) {
    this.router.navigate(['/product-detail', id]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}