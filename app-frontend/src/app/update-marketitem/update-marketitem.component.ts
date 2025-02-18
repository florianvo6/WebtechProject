import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { MarketitemService } from '../services/marketitem-service/marketitem.service';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createMarketItem, MarketItem } from '../models/marketitem';
import { Alert } from '../models/alert-type';

@Component({
  selector: 'app-update-marketitem',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './update-marketitem.component.html',
  styleUrl: './update-marketitem.component.css'
})

export class UpdateMarketitemComponent {
  id: number | undefined;
  marketItem: MarketItem = createMarketItem();
  alert: Alert | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private alertService: AlertService, private marketitemService: MarketitemService) { }

  async ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.marketItem.seller.owner = storedUsername;
    }

    if (storedName) {
        this.marketItem.seller.name = storedName;
    }

    if (storedAddress) {
      this.marketItem.seller.address = storedAddress;
    }

    this.route.params.subscribe(async (params) => {
      this.id = +params['id'];
    });

    await this.getMarketItem(this.id!);
  }

  getMarketItem(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.marketitemService.getMarketItemById(id).subscribe(
        (response) => {
          this.marketItem = response;
          console.info(this.marketItem);
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
      title: this.marketItem.title,
      description: this.marketItem.description,
      price: this.marketItem.price,
      condition: this.marketItem.condition,
      handover: this.marketItem.handover,
      id: this.id,
    };

    console.info(payload);

    this.marketitemService.updateMarketItem(payload).subscribe(
        (response: any) => {
            if (response && response.message) {
                this.alertService.success('Item updated successfully!');
            } else {
                this.alertService.error('Failed to update item. Please try again.');
            }
        },
        (error) => {
            this.alertService.error("Failed to update item! " + error.error.message + " Please try again.");
            console.error('Error response:', error);
        }
    );
  }

  goToProfil() {
    this.router.navigate(['/profile']);
  }
}
