import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert, AlertType } from '../models/alert-type';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
    alert$ = this.alertSubject.asObservable();

    success(message: string) {
        this.alertSubject.next({ type: AlertType.Success, message });
    }

    error(message: string) {
        this.alertSubject.next({ type: AlertType.Error, message });
    }

    clear() {
        this.alertSubject.next(null);
    }

    keepAfterRouteChange() {
      const currentAlert = this.alertSubject.getValue();
      this.alertSubject.next(currentAlert);
    }
}