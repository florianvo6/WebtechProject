import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertService } from '../services/alert-service/alert.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImageService } from '../services/image-service/image.service';
import { VehicleService } from '../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-vehicle',
  imports: [CommonModule, AlertComponent, NavbarComponent, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {
  data: any[] = [];
  owner: string | null = null;
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService, private imageService: ImageService, private vehicleService: VehicleService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getVehicles();
    await this.saveImgUrl(this.data);
  }

  getVehicles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleService.getVehicles(this.owner!, false).subscribe(
          (data: any) => {
              this.data = data;
              resolve();
          },
          (error) => {
              console.error('Error fetching products:', error);
              reject(error);
          }
      );
  });
}

  async filterData (brand: string, initialapproval: string) {
    await this.getVehicles();

    try {
      const initialApprovalNumber = initialapproval ? +initialapproval : null;

      if (brand && !initialApprovalNumber) {
        this.data = this.data.filter(item => brand === item.brand);
        await this.saveImgUrl(this.data);
      }
      else if (!brand && initialApprovalNumber) {
        this.data = this.data.filter(item => initialApprovalNumber === item.initialapproval);
        await this.saveImgUrl(this.data);
      }
      else if (brand && initialApprovalNumber) {
        this.data = this.data.filter(item => brand === item.brand && initialApprovalNumber === item.initialapproval);
        await this.saveImgUrl(this.data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async searchData () {
    await this.getVehicles();
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

        this.data = this.data.filter(item =>
            item.title.toLowerCase().includes(normalizedSearchTerm)
        );

        await this.saveImgUrl(this.data);
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

  async saveImgUrl(data: any[]): Promise<void> {
    data.forEach(item => {
      this.getImageUrl(item.image_id).then(url => {
          item.imageUrl = url;
      }).catch(error => {
          console.error(`Error fetching image URL for item ${item.id}:`, error);
          item.imageUrl = 'assets/real-estate.png';
      });
    });
  }

  async resetData() {
    await this.getVehicles();
    await this.saveImgUrl(this.data);
  }

  public navigateToAddPage() {
    this.router.navigate(['/add-vehicle']);
  }

  public navigateToDetailPage(id: number, url: string) {
    this.router.navigate(['/vehicle-detail', id, url]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}