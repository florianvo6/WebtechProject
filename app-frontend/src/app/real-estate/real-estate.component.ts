import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ImageService } from '../services/image-service/image.service';

@Component({
  selector: 'app-real-estate',
  imports: [CommonModule, AlertComponent, NavbarComponent, FormsModule],
  templateUrl: './real-estate.component.html',
  styleUrl: './real-estate.component.css'
})
export class RealEstateComponent {

  data: any[] = [];
  owner: string | null = null;
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService, private imageService: ImageService) { }

  async ngOnInit() {
    this.alertService.clear();
    this.owner = localStorage.getItem('username');

    await this.getProducts();
    await this.saveImgUrl(this.data);
  }

  getProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/real-estate').subscribe(
        (response: any) => {
          // Filter products based on owner
          this.data = response.filter((product: any) => product.owner !== this.owner);
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  }

  async filterData (type: string, selltype: string) {
    await this.getProducts();

    try {
      if (type && !selltype) {
        this.data = this.data.filter(item => type === item.type);
        await this.saveImgUrl(this.data);
      }
      else if (!type && selltype) {
        this.data = this.data.filter(item => selltype === item.handover);
        await this.saveImgUrl(this.data);
      }
      else if (type && selltype) {
        this.data = this.data.filter(item => type === item.type && selltype === item.selltype);
        await this.saveImgUrl(this.data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async searchData () {
    await this.getProducts();
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

        this.data = this.data.filter(item =>
            item.title.toLowerCase().includes(normalizedSearchTerm)
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
    await this.getProducts();
    await this.saveImgUrl(this.data);
  }

  public navigateToAddPage() {
    this.router.navigate(['/add-real-estate-item']);
  }

  public navigateToDetailPage(id: number, url: string) {
    this.router.navigate(['/real-estate-detail', id, url]);
  }

  gotoButtonClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}