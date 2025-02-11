import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Alert } from '../services/models/alert-type';
import { ChatService } from '../services/chat-service/chat.service';

@Component({
  selector: 'app-detail-chat',
  imports: [NavbarComponent, AlertComponent, FormsModule, CommonModule],
  templateUrl: './detail-chat.component.html',
  styleUrl: './detail-chat.component.css'
})
export class DetailChatComponent {
  chatUser: string | null = '';
  chatTitle: string | null = '';
  chatRecipient: string | null = '';
  chatId: number | undefined;
  newMessage: string = '';
  chat: any;
  messages: any[] = [];
  alert: Alert | null = null;
  
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private alertService: AlertService, private cdr: ChangeDetectorRef, private chatService: ChatService) {}

  async ngOnInit() {
    this.chatUser = localStorage.getItem('username');
    this.alertService.clear();
    this.route.params.subscribe(async params => {
      this.chatId = +params['id'];
    });

    await this.getChat(this.chatId!);
    await this.getMessages(this.chatId!);
    this.cdr.detectChanges();
  }

  getChat(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.chatService.getChatById(id).subscribe(
        (response) => {
          this.chat = response;
          resolve(); 
        },
        (error) => {
          this.alertService.error("Error: " + error.message)
          reject(error);
        }
      );
    });
  }

  getMessages(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.chatService.getMessagesById(id).subscribe(
        (response) => {
          this.messages = response;
          this.cdr.detectChanges();
          resolve();
        },
        (error) => {
          this.alertService.error("Error: " + error.message)
          reject(error);
        }
      );
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) {
      this.alertService.error("It's not possible to send an empty message! Please enter a message.")
      return;
    }

    const messageData = {
      chat_id: this.chatId,
      sender: this.chatUser,
      recipient: this.getRecipient(),
      text: this.newMessage,
      time: new Date().toString()
    };

    this.chatService.addMessage(messageData).subscribe(
      () => {
            if (this.chatId != null) {
              this.messages.push(messageData);
              this.cdr.detectChanges();
              this.newMessage = '';
            }
      }, 
      (error) => {
          this.alertService.error("Failed to send message! " + error.error.message + " Please try again.");
          console.error('Error response:', error);
      }
    );
  }

  deleteChat(id = this.chatId!): Promise<void> {
    return new Promise((resolve, reject) => {
        this.chatService.deleteChatById(id).subscribe(
            (response) => {
              this.alertService.success('Chat deleted successfully!');
              this.alertService.keepAfterRouteChange();
              this.cdr.detectChanges();
              this.goToInbox();
              resolve();
            },
            (error) => {
                this.alertService.error("Error: " + error.message)
                reject(error);
            }
        );
    });
  }
  
  getRecipient(): String {
    if (this.chatUser == this.chat.sender) {
        return this.chat.recipient;
    } else {
      return this.chat.sender;
    }
  }

  goToInbox() {
    this.router.navigate(['/inbox']);
  }
}
