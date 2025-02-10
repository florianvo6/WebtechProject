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


  constructor(private userService: UserService, private http: HttpClient, private router: Router, 
    private alertService: AlertService, private imageService: ImageService, 
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

    this.http.post('http://localhost:8000/user/change', { payload })
      .subscribe(
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

  async getImageUrl(imageId: string): Promise<string> {
      let imageUrl = '';
 
      try {
        const response = await firstValueFrom(this.imageService.downloadImage(imageId));
        if (response.success) {
            imageUrl = await this.setDirectDownloadFalse(response.downloadURL);
            console.log('Image URL:', imageUrl);
            return imageUrl;
        } else {
            console.error('Failed to retrieve image URL:', response);
            imageUrl = '';
        }
    } catch (error) {
        console.error('Error downloading image:', error);
    }
 
    return imageUrl;
    }
     
    async setDirectDownloadFalse(url: string): Promise<string> {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('directDownload', 'false');
      return parsedUrl.toString();
    }

  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.marketitemService.getMarketItems(this.currentUser!, true).subscribe(
            (data: any) => {
                this.marketplaceData = data;
                this.marketplaceData.forEach(async item => {
                  await this.getImageUrl(item.image_id).then(url => {
                      item.imageUrl = url;
                  }).catch(error => {
                      console.error(`Error fetching image URL for item ${item.id}:`, error);
                      item.imageUrl = 'assets/real-estate.png';
                  });
                });
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
              this.realEstateData.forEach(async item => {
                await this.getImageUrl(item.image_id).then(url => {
                    item.imageUrl = url;
                }).catch(error => {
                    console.error(`Error fetching image URL for item ${item.id}:`, error);
                    item.imageUrl = 'assets/real-estate.png';
                });
              });
              resolve();
          },
          (error) => {
              console.error('Error fetching products:', error);
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
              this.vehicleData.forEach(item => {
                this.getImageUrl(item.image_id).then(url => {
                    item.imageUrl = url;
                }).catch(error => {
                    console.error(`Error fetching image URL for item ${item.id}:`, error);
                    item.imageUrl = 'assets/real-estate.png';
                });
              });
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

  markItemAsSold(id: number) {}

  markRealEstateAsSold(id: number) {}

  markVehicleAsSold(id: number) {}

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
