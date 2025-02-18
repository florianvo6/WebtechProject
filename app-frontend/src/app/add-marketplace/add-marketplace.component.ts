import { HttpClient } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alert } from '../services/models/alert-type';
import { ImageService } from '../services/image-service/image.service';
import { firstValueFrom } from 'rxjs';
import { createMarketItem, MarketItem } from '../models/marketitem';
import { MarketitemService } from '../services/marketitem-service/marketitem.service';

@Component({
  selector: 'app-add-marketplace',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-marketplace.component.html',
  styleUrl: './add-marketplace.component.css'
})
export class AddMarketplaceComponent {
  marketItem: MarketItem = createMarketItem();
  jobId: number | null = null;
  selectedFile: File | null = null;
  alert: Alert | null = null;
  isLoading: boolean = false;

  constructor(private imageService: ImageService, private http: HttpClient, private router: Router, private alertService: AlertService, private marketitemService: MarketitemService) { }
 
  ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.marketItem.seller.owner = storedUsername;
    }

    if (storedName) {
        this.marketItem.seller.name = storedName;
    }

    if (storedAddress) {
      this.marketItem.seller.address = storedAddress;
    }
  }

  async addItem(): Promise<void> {
    const payload = {
      owner: this.marketItem.seller.owner,
      name: this.marketItem.seller.name,
      address: this.marketItem.seller.address,
      title: this.marketItem.title,
      description: this.marketItem.description,
      price: this.marketItem.price,
      condition: this.marketItem.condition,
      handover: this.marketItem.handover,
      image_id: this.marketItem.imageId,
    };

    this.marketitemService.addMarketItem(payload).subscribe(
        (response: any) => {
            if (response && response.message) {
                this.alertService.success('Item added successfully!');
                this.alertService.keepAfterRouteChange();
            } else {
                this.alertService.error('Failed to add item. Please try again.');
                this.alertService.keepAfterRouteChange();
            }
        },
        (error) => {
            this.alertService.error("Failed to add item! " + error.error.message + " Please try again.");
            console.error('Error response:', error);
        }
    );
  }

  async onUpload(): Promise<void> {
    this.isLoading = true;
    if (this.selectedFile) {
        try {
            const response = await firstValueFrom(this.imageService.uploadImage(this.selectedFile));
            this.jobId = response.jobID;
            await this.retrieveImageData();
        } catch (error) {
            console.error('Upload failed:', error);
            this.alertService.error('Upload failed!');
        }
    } else {
        this.alertService.error('Please select a file first.');
    }
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
  }
}

async retrieveImageData(): Promise<void> {
  if (this.jobId != null) {
      let attempts = 0;
      const maxAttempts = 10;
      const interval = 2000;

      while (attempts < maxAttempts) {
          try {
              const response = await firstValueFrom(this.imageService.getJobDetails(this.jobId.toString()));
              
              if (response.success) {
                  const finishedJobData = response.job.finishedJobData;

                  if (finishedJobData) {
                    this.marketItem.imageId = finishedJobData.fileID;
                    await this.addItem();
                    this.isLoading = false;

                    this.marketItem = createMarketItem();
                    const inputElement = document.getElementById('imageInput') as HTMLInputElement;
                    
                    if (inputElement) {
                      inputElement.value = '';
                    }
                    this.goToHome();
                    return;
                  } else {
                      console.warn('Finished job data is null. Retrying...');
                  }
              } else {
                  console.error('Job retrieval failed:', response);
              }
          } catch (error) {
              console.error('Error retrieving job details:', error);
          }

          attempts++;
          await new Promise(resolve => setTimeout(resolve, interval));
      }

      console.error('Max attempts reached. Job may not be finished or there was an error.');
  }
}

  goToProfil() {
    this.router.navigate(['/profile']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}