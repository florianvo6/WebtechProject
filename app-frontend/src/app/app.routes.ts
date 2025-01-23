import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Adjust the path as necessary
import { RegisterComponent } from './register/register.component'; // Adjust the path as necessary
import { NgModule } from '@angular/core';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' } 
];