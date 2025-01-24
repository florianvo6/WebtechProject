import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../services/models/alert-type';
import { AlertService } from '../services/alert-service/alert.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule, ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})

export class AlertComponent implements OnInit {
    alert: Alert | null = null;

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        this.alertService.alert$.subscribe(alert => {
            this.alert = alert;
            if (alert) {
                setTimeout(() => this.alert = null, 15000);
            }
        });
    }
}
