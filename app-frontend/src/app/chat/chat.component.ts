import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { AlertComponent } from '../alert/alert.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [NavbarComponent, AlertComponent, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  chatUser: string | null = '';
  chatPartner: string | null = '';
  isUserSender: boolean | undefined;
  data: any[] = [];

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {}

  async ngOnInit() {
    this.chatUser  = localStorage.getItem('username');

    await this.getChats();
  }

  getChats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8000/chats/recipient', { recipient: this.chatUser })
      .subscribe(
        (response: any) => {
          this.data = response;
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  }

  getRecipient(chatSender: String) : boolean {
        if (this.chatUser == chatSender) {
            return true;
        } else {
          return false;
        }
  }

  public navigateToDetailPage(id: number) {
    this.router.navigate(['/chat-detail', id]);
  }
}
