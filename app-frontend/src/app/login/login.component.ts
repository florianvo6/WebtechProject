import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  user: string = '';
  pass: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:3000/login', { user: this.user, pass: this.pass })
      .subscribe(
        (response: any) => {
          console.log(response); // Log the response for debugging
          if (response.token) {
            localStorage.setItem('token', response.token); // Store the token
            this.message = 'Login successful.';
            this.goToHome();
            // this.router.navigate(['/dashboard']); // Redirect to dashboard or home page
          } else {
            this.message = 'Login failed. No token received.';
          }
        },
        (error) => {
          this.message = `${error.error.message}`;
          console.error('Error response:', error); // Log the entire error response
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
