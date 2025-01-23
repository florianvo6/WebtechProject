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
    this.router.navigate(['/']);
  }

  goToRealEstate() {
    this.router.navigate(['/']);
  }

  goToVehicles() {
    this.router.navigate(['/']);
  }

  goToProfil() {
    this.router.navigate(['/']);
  }

  goToWelcome() {
    this.router.navigate(['/']);
  }
}
