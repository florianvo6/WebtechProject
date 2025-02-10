import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Alert } from '../services/models/alert-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../services/image-service/image.service';
import { firstValueFrom } from 'rxjs';
import { createRealestateItem, RealEstateItem } from '../models/realestateitem';
import { RealestateService } from '../services/realestate-service/realestate.service';

@Component({
  selector: 'app-add-real-estate',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-real-estate.component.html',
  styleUrl: './add-real-estate.component.css'
})
export class AddRealEstateComponent {
  realestateItem: RealEstateItem = createRealestateItem();
  jobId: number | null = null;
  selectedFile: File | null = null;
  alert: Alert | null = null;

  constructor(private imageService: ImageService, private http: HttpClient, private router: Router, private alertService: AlertService, private realestateService: RealestateService) { }
 
  ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.realestateItem.seller.owner = storedUsername;
    }

    if (storedName) {
        this.realestateItem.seller.name = storedName;
    }

    if (storedAddress) {
      this.realestateItem.seller.address = storedAddress;
    }
  }

  async addItem() {
    const payload = {
      owner: this.realestateItem.seller.owner,
      name: this.realestateItem.seller.name,
      address: this.realestateItem.seller.address,
      title: this.realestateItem.title,
      description: this.realestateItem.description,
      price: this.realestateItem.price,
      type: this.realestateItem.type,
      selltype: this.realestateItem.selltype,
      size: this.realestateItem.size,
      rooms: this.realestateItem.rooms,
      image_id: this.realestateItem.imageId,
    };

    this.realestateService.addRealestate(payload).subscribe(
      (response: any) => {
          if (response && response.message) {
              this.alertService.success('Item added successfully!');
          } else {
              this.alertService.error('Failed to add item. Please try again.');
          }
      },
      (error) => {
          this.alertService.error("Failed to add item! " + error.error.message + " Please try again.");
          console.error('Error response:', error);
      }
    );
  }
  
  async onUpload(): Promise<void> {
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
                      this.realestateItem.imageId = finishedJobData.fileID.toString();
                      await this.addItem();
                      
                      this.realestateItem = createRealestateItem();
                      const inputElement = document.getElementById('imageInput') as HTMLInputElement;
                      
                      if (inputElement) {
                        inputElement.value = '';
                      }
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
}