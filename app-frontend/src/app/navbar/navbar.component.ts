import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private alertService: AlertService, private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
    this.alertService.clear();
  }

  goToMarketplace() {
    this.router.navigate(['/marketplace']);
    this.alertService.clear();
  }

  goToRealEstate() {
    this.router.navigate(['/real-estate']);
    this.alertService.clear();
  }

  goToVehicles() {
    this.router.navigate(['/']);
    this.alertService.clear();
  }

  goToInbox() {
    this.router.navigate(['/inbox']);
    this.alertService.clear();
  }

  goToProfil() {
    this.router.navigate(['/']);
    this.alertService.clear();
  }

  goToWelcome() {
    this.router.navigate(['/']);
    this.alertService.clear();
  }
}
