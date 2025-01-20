import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Adjust the path as necessary
import { RegisterComponent } from './register/register.component'; // Adjust the path as necessary

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];
