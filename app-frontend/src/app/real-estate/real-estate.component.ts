import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getProducts();
  }

  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/real-estate').subscribe(
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

  async filterData (type: string, selltype: string) {
    await this.getProducts();

    try {
      if (type && !selltype) {
        this.data = this.data.filter(item => type === item.type);
      }
      else if (!type && selltype) {
        this.data = this.data.filter(item => selltype === item.handover);
      }
      else if (type && selltype) {
        this.data = this.data.filter(item => type === item.type && selltype === item.selltype);
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
    this.router.navigate(['/add-real-estate-item']);
  }

  public navigateToDetailPage(id: number) {
    this.router.navigate(['/real-estate-detail', id]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}