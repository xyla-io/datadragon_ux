import { Injectable } from '@angular/core';

import * as io from 'socket.io-client'
import {SessionService} from "./session.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import { UUID } from 'angular2-uuid';
import { environment } from './../../environments/environment';

@Injectable()
export class SocketService {

  private socketURL: string = environment.socketURL;
  socket: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private socketUserID?: string = null;

  constructor(private sessionService: SessionService) {
    this.connect();
    this.sessionService.session.subscribe(user => {
      if (user) {
        if (this.socketUserID === user._id) { return }
        this.socketUserID = user._id;
        this.connect();
      } else {
        if (!this.socketUserID) { return }
        this.socketUserID = null;
        this.connect();
      }
    });
  }

  private connect() {
    console.log('connecting');
    if (this.socket.value) {
      this.socket.value.disconnect();
    }
    let options: any = { forceNew: true };
    if (environment.apiKey !== null) {
      // options.transportOptions = {
      //   polling: {
      //     extraHeaders: {
      //       'X-DataDragon-Api-Key': environment.socketAPIKey,
      //     }
      //   }
      // };
      options.query = { apikey: environment.apiKey };
    }
    let socket = io(this.socketURL, options);
    this.socket.next(socket);
  }

  observeEvent(event: string): Observable<any> {
    return this.socket.switchMap(socket => {
      let observable = new Subject<any>();
      socket.on(event, content => {
        observable.next(content);
      });
      return observable;
    });
  }

  observeValue(event: string): BehaviorSubject<any> {
    return this.socket.switchMap(socket => {
      let observable = new BehaviorSubject<any>(null);
      socket.on(event, content => {
        observable.next(content);
      });
      return observable;
    }) as BehaviorSubject<any>;
  }

  get(event: string, requestParameters: object = {}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let parameters = {
        requestId: UUID.UUID(),
        parameters: requestParameters,
      };
      var subscription;
      subscription = this.observeEvent(`${event}:${parameters.requestId}`).subscribe(value => {
        resolve(value);
        subscription.unsubscribe();
      });
      this.sendEvent(event, parameters);
    });
  }

  sendEvent(event: string, value: any = null) {
    this.socket.value.emit(event, value);
  }

}
