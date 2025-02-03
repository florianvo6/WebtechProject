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

@Component({
  selector: 'app-add-real-estate',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-real-estate.component.html',
  styleUrl: './add-real-estate.component.css'
})
export class AddRealEstateComponent {
  title: string = '';
  owner: string = '';
  description: string = '';
  price: number | null = null;
  address: string = '';
  type: string = '';
  selltype: string = '';
  rooms: string = '';
  size: string = '';
  name: string = '';
  imageUrl: string = '';

  imageId: number | null = null;
  jobId: number | null = null;
  selectedFile: File | null = null;
  alert: Alert | null = null;

  constructor(private imageService: ImageService, private http: HttpClient, private router: Router, private alertService: AlertService) { }
 
  ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.owner = storedUsername;
    }

    if (storedName) {
        this.name = storedName;
    }

    if (storedAddress) {
      this.address = storedAddress;
    }
  }

  addItem() {
    this.http.post('http://localhost:8000/add-real-estate', { owner: this.owner, name: this.name, address: this.address, title: this.title, description: this.description, price: this.price, type: this.type, size: this.size, rooms: this.rooms, selltype: this.selltype, image_url: this.imageUrl})
      .subscribe(
        (response: any) => {
          console.log(response);
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

  goToProfil() {
    this.router.navigate(['/profil']);
  }

  goToRealEstate() {
    this.router.navigate(['/real-estate']);
  }

  onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
          this.selectedFile = input.files[0];
      }
    }
  
    async onUpload(): Promise<void> {
      if (this.selectedFile) {
          try {
              const response = await firstValueFrom(this.imageService.uploadImage(this.selectedFile));
              console.log('Upload successful:', response);
              this.jobId = response.jobID;
              await this.retrieveImageData();
              this.goToRealEstate()
          } catch (error) {
              console.error('Upload failed:', error);
              this.alertService.error('Upload failed!');
          }
      } else {
          this.alertService.error('Please select a file first.');
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
                console.log('Job details:', response);
                if (response.success) {
                    const finishedJobData = response.job.finishedJobData;
  
                    if (finishedJobData) {
                        this.imageId = finishedJobData.fileID;
                        await this.retrieveImage();
                        console.log('Image ID:', this.imageId);
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
  
  async retrieveImage(): Promise<void> {
    if (this.imageId) {
        try {
            const response = await firstValueFrom(this.imageService.downloadImage(this.imageId.toString()));
            if (response.success) {
                this.imageUrl = await this.setDirectDownloadFalse(response.downloadURL); 
                console.log('Image URL:', this.imageUrl);
                await this.addItem();
            } else {
                console.error('Failed to retrieve image URL:', response);
            }
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    }
  }
  
  async setDirectDownloadFalse(url: string): Promise<string> {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.set('directDownload', 'false');
    return parsedUrl.toString();
  }
}