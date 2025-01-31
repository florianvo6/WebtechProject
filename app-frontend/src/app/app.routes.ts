import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { RegisterComponent } from './register/register.component'; 
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { AddMarketplaceComponent } from './add-marketplace/add-marketplace.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { RealEstateComponent } from './real-estate/real-estate.component';
import { AddRealEstateComponent } from './add-real-estate/add-real-estate.component';
import { ChatComponent } from './chat/chat.component';
import { DetailChatComponent } from './detail-chat/detail-chat.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'add-market-item', component: AddMarketplaceComponent },
  { path: 'product-detail/:id', component: DetailItemComponent },
  { path: 'real-estate', component: RealEstateComponent },
  { path: 'add-real-estate-item', component: AddRealEstateComponent },
  { path: 'inbox', component: ChatComponent },
  { path: 'chat-detail/:id', component: DetailChatComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' } 
];