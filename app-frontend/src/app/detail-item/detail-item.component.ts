import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-detail-item',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './detail-item.component.html',
  styleUrl: './detail-item.component.css'
})
export class DetailItemComponent {
  item: any;
  id: number | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.id = +params['id'];
      await this.getData(this.id);
    });

    console.info(this.id);
    console.info(this.item);
  }

  getData(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8000/products/id', { id: this.id })
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

  sendMessage() {
    alert('Message sent to the seller!');
  }
}