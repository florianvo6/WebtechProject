import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { Alert } from '../services/models/alert-type';
import { AlertComponent } from "../alert/alert.component";
import { MarketitemService } from '../services/marketitem-service/marketitem.service';
import { ImageService } from '../services/image-service/image.service';
import { firstValueFrom } from 'rxjs';
import { RealestateService } from '../services/realestate-service/realestate.service';
import { VehicleService } from '../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  marketItemData: any[] = [];
  realestateItemData: any[] = [];
  vehicleData: any[] = [];

  constructor(private router: Router, private alertService: AlertService, private marketitemService: MarketitemService, private realestateService: RealestateService, private vehicleService: VehicleService ,private imageService: ImageService) {}

  async ngOnInit() {
    await this.getProducts();
    await this.getRealEstate();
    await this.getVehicles();
    await this.saveImgUrl(this.marketItemData, "market");
    await this.saveImgUrl(this.realestateItemData, "realestate");
    await this.saveImgUrl(this.vehicleData, "vehicle");
  }

  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.marketitemService.getAllMarketItems().subscribe(
            (data: any) => {
                this.marketItemData = data;
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
        this.realestateService.getAllRealEstate().subscribe(
            (data: any) => {
                this.realestateItemData = data;
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
        this.vehicleService.getAllVehicles().subscribe(
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

  addMarketItemUrl(id: number, url: string): Promise<void> {
      const payload = {
        id: id,
        image_url: url
      };

      return new Promise((resolve, reject) => {
        this.marketitemService.addImageUrl(payload).subscribe(
          (response) => {
            resolve();
          },
          (error) => {
              reject(error);
          }
      );
    });
  }

  addRealEstateUrl(id: number, url: string): Promise<void> {
      const payload = {
        id: id,
        image_url: url
      };

      return new Promise((resolve, reject) => {
        this.realestateService.addImageUrl(payload).subscribe(
          (response) => {
            resolve();
          },
          (error) => {
              reject(error);
          }
      );
    });
  }

  addVehicleUrl(id: number, url: string): Promise<void> {
      const payload = {
        id: id,
        image_url: url
      };

      return new Promise((resolve, reject) => {
        this.vehicleService.addImageUrl(payload).subscribe(
          (response) => {
            resolve();
          },
          (error) => {
              reject(error);
          }
      );
    });
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

  async saveImgUrl(data: any[], category: string): Promise<void> {
    for (const item of data) {
        try {
            const url = await this.getImageUrl(item.image_id);
            if (category == "market")
              await this.addMarketItemUrl(item.id, url);
            if (category == "realestate")
              await this.addRealEstateUrl(item.id, url);
            if (category == "vehicle")
              await this.addVehicleUrl(item.id, url);
        } catch (error) {
            console.error(`Error processing image URL for item ${item.id}:`, error);
            item.imageUrl = 'assets/real-estate.png';
        }
    }
  }

  goToMarketplace() {
    this.router.navigate(['/marketplace']);
  }

  goToRealEstate() {
    this.router.navigate(['/real-estate']);
  }

  goToVehicles() {
    this.router.navigate(['/vehicle']);
  }
}
