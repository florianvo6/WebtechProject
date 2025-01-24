import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert-service/alert.service';
import { Alert } from '../services/models/alert-type';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, AlertComponent]
})
export class LoginComponent {
  user: string = '';
  pass: string = '';
  message: string = '';
  alert: Alert | null = null;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.clear();
  }

  login() {
    this.http.post('http://localhost:3000/login', { user: this.user, pass: this.pass })
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.alertService.success("Login successful! Welcome back " + response.name + ", nice to see you.");
            this.alertService.keepAfterRouteChange();
            this.goToHome();
          } else {
            this.alertService.error('Login failed. Please try again.');
          }
        },
        (error) => {
          this.alertService.error("Login failed! " + error.error.message + " Please try again.");
          console.error('Error response:', error);
        }
      );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
