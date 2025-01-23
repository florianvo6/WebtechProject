import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: string = '';
  mail: string = '';
  name: string = '';
  pass: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}
  
  register() {
    this.http.post('http://localhost:3000/register', { user: this.user, pass: this.pass })
      .subscribe(
        (response: any) => {
          console.log(response); // Log the response for debugging
          if (response && response.message) {
            this.message = response.message; // Set the message from the response
          } else {
            this.message = 'Registration successful!'; // Default success message
          }
        },
        (error) => {
          this.message = `Registration failed. ${error.error.message}`;
          console.error('Error response:', error); // Log the entire error response
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