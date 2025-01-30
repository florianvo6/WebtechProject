import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { Alert } from '../services/models/alert-type';
import { AlertComponent } from "../alert/alert.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  constructor(private router: Router, private alertService: AlertService) {}

  goToMarketplace() {
    this.router.navigate(['/marketplace']);
  }

  goToRealEstate() {
    this.router.navigate(['/real-estate']);
  }

  goToVehicles() {
    this.router.navigate(['/']);
  }
}
