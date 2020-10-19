import { Injectable } from '@angular/core';
import {CheshireTermsApp} from "../models/cheshire-terms";
import {Observable} from "rxjs/Observable";
import {SocketService} from "./socket.service";

export interface CheshireTermReportParameters {
  rootTerm: string;
  priorityThreshold: number;
  appId: number;
}

@Injectable()
export class CheshireTermsService {

  constructor(private socketService: SocketService) {}

  observeApps(): Observable<CheshireTermsApp[]> {
    return this.socketService.observeValue('cheshireTermsApps').map(value => (value) ? value as CheshireTermsApp[] : []);
  }

  refreshApps() {
    this.socketService.sendEvent('cheshireTermsApps');
  }
}
