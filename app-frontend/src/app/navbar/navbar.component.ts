import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToMarketplace() {
    this.router.navigate(['/marketplace']);
  }

  goToRealEstate() {
    this.router.navigate(['/real-estate']);
  }

  goToVehicles() {
    this.router.navigate(['/']);
  }

  goToInbox() {
    this.router.navigate(['/inbox']);
  }

  goToProfil() {
    this.router.navigate(['/']);
  }

  goToWelcome() {
    this.router.navigate(['/']);
  }
}
