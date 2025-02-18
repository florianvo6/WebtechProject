import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert-service/alert.service';
import { Alert } from '../services/models/alert-type';
import { AlertComponent } from '../alert/alert.component';
import { MarketitemService } from '../services/marketitem-service/marketitem.service';
import { ChatService } from '../services/chat-service/chat.service';

@Component({
  selector: 'app-detail-item',
  imports: [CommonModule, NavbarComponent, FormsModule, CommonModule, AlertComponent],
  templateUrl: './detail-item.component.html',
  styleUrl: './detail-item.component.css'
})
export class DetailItemComponent {
  item: any;
  id: number | undefined;
  showMessageInput: boolean = false;
  messageText: string = '';
  sender: string | null = '';
  recipient: string | null = '';
  title: string | null = '';
  alert: Alert | null = null;
  imageUrl: string | null = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private alertService: AlertService, private marketitemService: MarketitemService, private chatService: ChatService) {
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.id = +params['id'];
      this.imageUrl = params['url'];
    });

    this.sender = localStorage.getItem('username');
    await this.getMarketItem(this.id!);
    this.recipient = this.item.owner;
    this.title = this.item.title;
  }

  getMarketItem(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.marketitemService.getMarketItemById(id).subscribe(
        (response) => {
          this.item = response;
          resolve(); 
        },
        (error) => {
          this.alertService.error("Error: " + error.message)
          reject(error);
        }
      );
    });
  }

  toggleMessageInput() {
    this.showMessageInput = !this.showMessageInput;
  }

  sendMessage() {
    if (!this.messageText.trim()) {
      alert("Please enter a message.");
      return;
    }

    const chatPayload = {
      sender: this.sender,
      title: this.title,
      recipient: this.recipient
    };

    this.chatService.addChat(chatPayload).subscribe(
      (chatResponse: any) => {
          const messagePayload = {
              chat_id: chatResponse.id,
              sender: chatPayload.sender,
              recipient: chatPayload.recipient,
              text: this.messageText,
              time: new Date().toString()
          };

          this.chatService.addMessage(messagePayload).subscribe(
              () => {
                  this.alertService.success("Message sent successfully!");
                  this.messageText = '';
                  this.showMessageInput = false;
              },
              (error) => {
                  console.error("Error sending message:", error);
                  this.alertService.error("Error sending message.");
              }
          );
      },
      (error) => {
          console.error("Error creating chat:", error);
          this.alertService.error("Error creating chat.");
      }
    );
  }
}