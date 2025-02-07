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


  constructor(private userService: UserService, private http: HttpClient, private router: Router, private alertService: AlertService, private imageService: ImageService) {}

  async ngOnInit() {
    this.currentUser  = localStorage.getItem('username');
    console.log(this.currentUser);
    if (this.currentUser ) {
      await this.getUserData(this.currentUser );
    }

    await this.getRealEstate();
    this.realEstateData.forEach(async item => {
      await this.getImageUrl(item.image_id).then(url => {
          item.imageUrl = url;
      }).catch(error => {
          console.error(`Error fetching image URL for item ${item.id}:`, error);
          item.imageUrl = 'assets/real-estate.png';
      });
    });

    await this.getVehicles();
    this.vehicleData.forEach(item => {
      this.getImageUrl(item.image_id).then(url => {
          item.imageUrl = url;
      }).catch(error => {
          console.error(`Error fetching image URL for item ${item.id}:`, error);
          item.imageUrl = 'assets/real-estate.png';
      });
    });

    await this.getMarketplace();
    this.marketplaceData.forEach(async item => {
      await this.getImageUrl(item.image_id).then(url => {
          item.imageUrl = url;
      }).catch(error => {
          console.error(`Error fetching image URL for item ${item.id}:`, error);
          item.imageUrl = 'assets/real-estate.png';
      });
    });
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

  getRealEstate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/real-estate').subscribe(
        (response: any) => {
          this.realEstateData = response.filter((product: any) => product.owner == this.currentUser);
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  }

  getMarketplace(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/marketitems').subscribe(
        (response: any) => {
          // Filter products based on owner
          this.marketplaceData = response.filter((product: any) => product.owner == this.currentUser);
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
      this.http.get('http://localhost:8000/vehicle').subscribe(
        (response: any) => {
          // Filter products based on owner
          this.vehicleData = response.filter((product: any) => product.owner == this.currentUser);
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  }

  editMarketItem(id: number) {}

  editRealEstate(id: number) {}

  editVehicle(id: number) {}

  delteMarketItem(id: number) {}

  deleteVehicle(id: number) {}

  deleteRealEstate(id: number) {}

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
