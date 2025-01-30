import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Alert } from '../services/models/alert-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-real-estate',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-real-estate.component.html',
  styleUrl: './add-real-estate.component.css'
})
export class AddRealEstateComponent {
  title: string = '';
  owner: string = '';
  description: string = '';
  price: number | null = null;
  address: string = '';
  type: string = '';
  selltype: string = '';
  rooms: string = '';
  size: string = '';
  name: string = '';
  alert: Alert | null = null;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }
 
  ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.owner = storedUsername;
    }

    if (storedName) {
        this.name = storedName;
    }

    if (storedAddress) {
      this.address = storedAddress;
    }
  }

  addItem() {
    const productData = {
      title: this.title,
      owner: this.owner,
      name: this.name,
      description: this.description,
      price: this.price,
      address: this.address,
      type: this.type,
      selltype: this.selltype,
      size: this.size,
      rooms: this.rooms
  };

  console.log(productData);
    this.http.post('http://localhost:8000/add-real-estate', { owner: this.owner, name: this.name, address: this.address, title: this.title, description: this.description, price: this.price, type: this.type, size: this.size, rooms: this.rooms, selltype: this.selltype})
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response && response.message) {
            this.alertService.success('Item added successfully!');
          } else {
            this.alertService.error('Failed to add item. Please try again.');
          }
        },
        (error) => {
          this.alertService.error("Failed to add item! " + error.error.message + " Please try again.");
          console.error('Error response:', error);
        }
      );
  }

  goToProfil() {
    this.router.navigate(['/profil']);
  }
}