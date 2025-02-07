import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert-service/alert.service';
import { Alert } from '../services/models/alert-type';
import { AlertComponent } from '../alert/alert.component';

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

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private alertService: AlertService) {
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.id = +params['id'];
      this.imageUrl = params['url'];
      this.sender = localStorage.getItem('username');
      await this.getData(this.id);
      this.recipient = this.item.owner;
      this.title = this.item.title;
    });
  }

  getData(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8000/marketitem/id', { id: this.id })
      .subscribe(
        (response: any) => {
          this.item = response;
          console.info(response);
          resolve();
        },
        (error) => {
          console.error('Error fetching products:', error);
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

    const newChat = {
      sender: this.sender,
      title: this.title,
      recipient: this.recipient
    };

    this.http.post('http://localhost:8000/chats', newChat).subscribe(
      (chatResponse: any) => {

        const newMessage = {
          chat_id: chatResponse.id,
          sender: newChat.sender,
          recipient: newChat.recipient,
          text: this.messageText,
          time: new Date().toString()
        };

        this.http.post('http://localhost:8000/add-message', newMessage).subscribe(
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