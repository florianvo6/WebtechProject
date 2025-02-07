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

@Component({
  selector: 'app-add-marketplace',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-marketplace.component.html',
  styleUrl: './add-marketplace.component.css'
})
export class AddMarketplaceComponent {
  title: string = '';
  owner: string = '';
  description: string = '';
  price: number | null = null;
  address: string = '';
  condition: string = '';
  handover: string = '';
  name: string = '';
  image_id: number | null = null;

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

  async addItem(): Promise<void>{
    this.http.post('http://localhost:8000/add-marketitem', { title: this.title,  owner: this.owner, description: this.description, price: this.price, address: this.address, condition: this.condition, handover: this.handover, name: this.name, image_id: this.image_id})
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
    this.router.navigate(['/profile']);
  }

  goToMarketplace() {
    this.router.navigate(['/add-market-item']);
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
            this.goToMarketplace()
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
                    this.image_id = finishedJobData.fileID;
                    console.log('Image ID:', this.image_id);
                    await this.addItem();
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
}