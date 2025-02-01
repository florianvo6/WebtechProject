import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert-service/alert.service';
import { AlertComponent } from '../alert/alert.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Alert } from '../services/models/alert-type';

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
  
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private alertService: AlertService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.chatUser = localStorage.getItem('username');
    this.alertService.clear();
    this.route.params.subscribe(async params => {
      this.chatId = +params['id'];
      await this.getData(this.chatId);
      await this.getMessages(this.chatId);
      this.cdr.detectChanges();
      console.info(this.messages);
    });
  }

  getData(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8000/chat/id', { id: this.chatId })
      .subscribe(
        (response: any) => {
          this.chat = response;
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  }

  getMessages(chatId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        this.http.post('http://localhost:8000/messages/chatId', { id: chatId })
            .subscribe((response: any) => {
                this.messages = response;
                this.cdr.detectChanges();
                resolve();
            }, error => {
                console.error('Error fetching messages:', error);
                reject(error);
            });
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim()) {
      this.alertService.error("It's not possible to send an empty message! Please enter a message.")
      return;
    }

    const messageData = {
      chat_id: this.chatId,
      sender: this.chatUser,
      recipient: await this.getRecipient(),
      text: this.newMessage,
      time: new Date().toString()
    };

    console.info(messageData);

    this.http.post('http://localhost:8000/add-message', messageData).subscribe(
      () => {
        if(this.chatId != null) {
        this.messages.push(messageData);
        this.cdr.detectChanges();
        this.newMessage = '';
        }
      },
      (error) => {
        console.error("Error sending message:", error);
        alert("Error sending message.");
      }
    );
  }

  deleteChat(id = this.chatId): Promise<void> {
    return new Promise((resolve, reject) => {
        this.http.delete('http://localhost:8000/delete-chat/chatId/' + id)
            .subscribe((response: any) => {
                this.alertService.success('Chat deleted successfully!');
                this.alertService.keepAfterRouteChange();
                this.cdr.detectChanges();
                this.goToInbox();
                resolve();
            }, error => {
                console.error('Error deleting chat:', error);
                reject(error);
            });
    });
  }
  
  getRecipient(): Promise<string> {
    return new Promise((resolve) => {
        if (this.chatUser  !== this.chat.sender) {
            resolve(this.chat.sender);
        } else {
            resolve(this.chat.recipient);
        }
    });
  }

  goToInbox() {
    this.router.navigate(['/inbox']);
  }
}
