import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from "./services/session.service";
import {ApiErrorService} from "./services/api-error.service";
import {Subscription} from "rxjs/Subscription";
import {NewRelicService} from "./services/new-relic.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'DataDragon';
  public isSignedIn: boolean = false;
  private sessionSubscription: Subscription;

  constructor(private sessionService: SessionService, apiErrorService: ApiErrorService, newRelicService: NewRelicService) { }

  signOut() {
    this.sessionService.signOut();
  }

  deleteAccount() {
    this.sessionService.deleteAccount(this.sessionService.session.value._id.toString());
  }

  ngOnInit() {
    this.sessionSubscription = this.sessionService.session.subscribe(session => {
      this.isSignedIn = session !== null;
    });
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }
}
