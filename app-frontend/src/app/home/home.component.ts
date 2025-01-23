import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  goToMarketplace() {
    this.router.navigate(['/login']);
  }

  goToRealEstate() {
    this.router.navigate(['/']);
  }

  goToVehicles() {
    this.router.navigate(['/']);
  }
}
