import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { AlertComponent } from '../alert/alert.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat-service/chat.service';

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

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService, private chatService: ChatService) {}

  async ngOnInit() {
    this.chatUser  = localStorage.getItem('username');

    await this.getChats();
  }

  getChats(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.chatService.getUserChats(this.chatUser!).subscribe(
            (data: any) => {
                this.data = data;
                resolve();
            },
            (error) => {
                console.error('Error fetching chats:', error);
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
