import { Component } from '@angular/core';
import { ImageService } from '../services/image-service/image.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { Alert } from '../services/models/alert-type';
import { Create, VehicleItem } from '../models/vehicle';
import { firstValueFrom } from 'rxjs';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  imports: [AlertComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.css'
})

export class AddVehicleComponent {
  vehicleItem: VehicleItem = Create();
  jobId: number | null = null;
  selectedFile: File | null = null;
  alert: Alert | null = null;
  isLoading: boolean = false;

  constructor(private imageService: ImageService, private http: HttpClient, private router: Router, private alertService: AlertService, private vehicleService: VehicleService) { }
 
  ngOnInit() {
    this.alertService.clear();
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('address');
    if (storedUsername) {
        this.vehicleItem.seller.owner = storedUsername;
    }

    if (storedName) {
        this.vehicleItem.seller.name = storedName;
    }

    if (storedAddress) {
      this.vehicleItem.seller.address = storedAddress;
    }
  }

  async addVehicle(): Promise<void> {
    let payload = {
      owner: this.vehicleItem.seller.owner,
      name: this.vehicleItem.seller.name,
      address: this.vehicleItem.seller.address,
      title: this.vehicleItem.title,
      description: this.vehicleItem.description,
      price: this.vehicleItem.price,
      brand: this.vehicleItem.brand,
      initialapproval: this.vehicleItem.initialapproval,
      mileage: this.vehicleItem.mileage,
      image_id: this.vehicleItem.imageId
    };

    this.vehicleService.addVehicle(payload).subscribe(
      (response: any) => {
          if (response && response.message) {
              this.alertService.success('Vehicle added successfully!');
              this.alertService.keepAfterRouteChange();
          } else {
              this.alertService.error('Failed to add vehicle. Please try again.');
              this.alertService.keepAfterRouteChange();
          }
      },
      (error) => {
          this.alertService.error("Failed to add vehicle! " + error.error.message + " Please try again.");
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
                        this.vehicleItem.imageId = finishedJobData.fileID.toString();
                        await this.addVehicle();
                        this.isLoading = false;

                        this.vehicleItem = Create();
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
