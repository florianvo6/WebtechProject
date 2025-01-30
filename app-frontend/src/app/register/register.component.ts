import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { Alert } from '../services/models/alert-type';
import { AlertService } from '../services/alert-service/alert.service';
import { response } from 'express';

@Component({
  selector: 'app-register',
  imports: [FormsModule, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: string = '';
  mail: string = '';
  name: string = '';
  pass: string = '';
  address: string = '';
  alert: Alert | null = null;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {}
  
  ngOnInit() {
    this.alertService.clear();
  }
  
  register() {
    this.http.post('http://localhost:8000/register', { user: this.user, pass: this.pass, name: this.name, mail: this.mail, address: this.address })
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response && response.message) {
            this.alertService.success('Registration successful! You can now log in to your account.');
          } else {
            this.alertService.error('Registration failed. Please try again.');
          }
        },
        (error) => {
          this.alertService.error("Registration failed! " + error.error.message + " Please try again.");
          console.error('Error response:', error);
        }
      );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}