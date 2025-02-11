import { Component } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user-service/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { ImageService } from '../services/image-service/image.service';
import { firstValueFrom } from 'rxjs';
import { createUser, User } from '../models/user';
import { MarketitemService } from '../services/marketitem-service/marketitem.service';
import { VehicleService } from '../services/vehicle-service/vehicle.service';
import { RealestateService } from '../services/realestate-service/realestate.service';


@Component({
  selector: 'app-profile',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User = createUser ();
  currentUser: string | null = '';
  marketplaceData: any[] = [];
  realEstateData: any[] = [];
  vehicleData: any[] = [];


  constructor(private userService: UserService, private router: Router, private alertService: AlertService,
    private marketitemService: MarketitemService, private vehicleService: VehicleService,
    private realestateService: RealestateService) {}

  async ngOnInit() {
    this.currentUser  = localStorage.getItem('username');
    if (this.currentUser ) {
      await this.getUserData(this.currentUser);
    }

    await this.getRealEstate();
    await this.getVehicles();
    await this.getProducts();
  }

  async getUserData(currentUser: string): Promise<void> {
    this.userService.getUserByUsername(currentUser).subscribe(
      (data) => {
        this.user = {
          login: data.login,
          password: data.password,
          name: data.name,
          email: data.email,
          address: data.address
        };
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
  }

  async onSubmit() {
    const payload = {
      login: this.user.login,
      password: this.user.password,
      name: this.user.name,
      email: this.user.email,
      address: this.user.address,
      currentUser: this.currentUser
    };

    this.userService.changeUserSetting(payload).subscribe(
      (response: any) => {
        this.user = response;
        if (response) {
          this.goToWelcome();
          this.alertService.success('Settings changed successfully. Please log in again!');
          this.alertService.keepAfterRouteChange();
          } else {
              this.alertService.error('Failed to change settings. Please try again.');
          }
      },
      (error) => {
          this.alertService.error("Failed to change settings! " + error.error.message + " Please try again.");
          console.error('Error response:', error);
      }
    );
  }

  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.marketitemService.getMarketItems(this.currentUser!, true).subscribe(
            (data: any) => {
                this.marketplaceData = data;
                resolve();
            },
            (error) => {
                console.error('Error fetching products:', error);
                reject(error);
            }
        );
    });
  }
  
  getRealEstate(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.realestateService.getRealEstate(this.currentUser!, true).subscribe(
            (data: any) => {
                this.realEstateData = data;
                resolve();
            },
            (error) => {
                console.error('Error fetching real estate items:', error);
                reject(error);
            }
        );
    });
  }

  getVehicles(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.vehicleService.getVehicles(this.currentUser!, true).subscribe(
            (data: any) => {
                this.vehicleData = data;
                resolve();
            },
            (error) => {
                console.error('Error fetching products:', error);
                reject(error);
            }
        );
    });
  }

  public navigateToUpdateMarketItem(id: number) {
    this.router.navigate(['/product-update', id]);
  }

  public navigateToUpdateRealEstate(id: number) {
    this.router.navigate(['/real-estate-update', id]);
  }

  public navigateToUpdateVehicle(id: number) {
    this.router.navigate(['/vehicle-update', id]);
  }

  delteMarketItem(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        this.marketitemService.deleteMarketItem(id).subscribe(
            (response) => {
                this.alertService.success("Item deleted successfully.")
                this.getProducts();
                resolve(); 
            },
            (error) => {
                this.alertService.error("Error: " + error.message)
                reject(error);
            }
        );
    });
  }

  deleteRealEstate(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.realestateService.deleteRealestate(id).subscribe(
          (response) => {
              this.alertService.success("Item deleted successfully.")
              this.getRealEstate();
              resolve(); 
          },
          (error) => {
              this.alertService.error("Error: " + error.message)
              reject(error);
          }
      );
    });
  }

  deleteVehicle(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleService.deleteVehicle(id).subscribe(
          (response) => {
              this.alertService.success("Vehicle deleted successfully.")
              this.getVehicles();
              resolve(); 
          },
          (error) => {
              this.alertService.error("Error: " + error.message)
              reject(error);
          }
      );
    });
  }

  markItemAsSold(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.marketitemService.markItemAsSold(id).subscribe(
          () => {
              this.alertService.success("Market item marked as sold.")
              this.getProducts();
              resolve(); 
          },
          (error) => {
              this.alertService.error("Error: " + error.message)
              reject(error);
          }
      );
    });
  }

  markRealEstateAsSold(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.realestateService.markRealestateAsSold(id).subscribe(
          () => {
              this.alertService.success("Real estate item marked as sold.")
              this.getRealEstate();
              resolve(); 
          },
          (error) => {
              this.alertService.error("Error: " + error.message)
              reject(error);
          }
      );
    });
  }

  markVehicleAsSold(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleService.markVehicleAsSold(id).subscribe(
          () => {
              this.alertService.success("Vehicle marked as sold.")
              this.getVehicles();
              resolve(); 
          },
          (error) => {
              this.alertService.error("Error: " + error.message)
              reject(error);
          }
      );
    });
  }

  goToWelcome() {
    this.router.navigate(['/welcome']);
  }

  navigateToAddMarketItemPage() {
    this.router.navigate(['/add-market-item']);
  }

  navigateToAddRealEstateItemPage() {
    this.router.navigate(['/add-real-estate-item']);
  }

  navigateToAdVehicleItemPage() {
    this.router.navigate(['/add-vehicle']);
  }

  navigateToInboxPage() {
    this.router.navigate(['/inbox']);
  }

  navigateToDetailPage(itemid: number) {}
}
