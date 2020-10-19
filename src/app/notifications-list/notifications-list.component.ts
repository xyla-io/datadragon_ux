import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent extends DataSource<Notification> implements OnInit {

  @Output() editRuleEmitter = new EventEmitter<string>();
  @Output() showHistoryEmitter = new EventEmitter<string>();

  showNotifications = true;
  flagDateThreshold: number;

  public displayedColumns = [
    'date',
    'messages',
    'associations'
  ];

  constructor(
    private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit() {
    const now = new Date();
    const milliseconds = 24 * 60 * 60 * 1000;
    this.flagDateThreshold = now.getTime() - milliseconds;
  }

  connect(): Observable<Notification[]> {
    return this.notificationService.getNotifications().pipe(map((notifications) => {
      this.showNotifications = notifications.length > 0;
      return notifications.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
    }));
  }

  disconnect() {}

  showHistory(ruleID: string) {
    console.log('Show history for rule!');
    this.showHistoryEmitter.emit(ruleID);
  }

  editRule(ruleID: string) {
    this.editRuleEmitter.emit(ruleID);
  }
}
