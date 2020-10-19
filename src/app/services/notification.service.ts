import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../models/notification';

@Injectable()
export class NotificationService {

  private notificationsURL = `${this.api.baseURL}/notifications`;

  constructor(private api: ApiService) {
    const now = new Date();
    this.twoWeeks.setDate(now.getDate() - 14);
  }
  private twoWeeks = new Date();

  getNotifications(startDate: Date = this.twoWeeks, endDate?: Date): Observable<Notification[]> {
    const url = `${this.notificationsURL}/search`;
    console.log(startDate.toISOString());
    return this.api.post(url, {
      startDate: startDate.toISOString(),
    }).map(response => response.json().notifications.map(notification => ({
      ...notification,
      date: new Date(notification.date)
    }) as Notification[]));
  }
}
