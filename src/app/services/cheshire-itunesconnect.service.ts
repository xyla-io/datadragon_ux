import {Injectable} from '@angular/core';
import {CheshireTermsApp} from "../models/cheshire-terms";
import {Observable} from "rxjs/Observable";
import {SocketService} from "./socket.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export interface CheshireItunesconnectProvider {
  providerName: string;
  providerId: string;
}

export interface CheshireItunesconnectApp {
  name: string;
  adamId: string;
}

export interface CheshireItunesconnectState {
  providers: CheshireItunesconnectProvider[];
  apps: CheshireItunesconnectApp[];
  selectedProviderId?: string;
  selectedAppId?: string;
}

@Injectable()
export class CheshireItunesconnectService {

  public state: CheshireItunesconnectState = {
    providers: [],
    apps: [],
    selectedProviderId: null,
  };

  constructor(private socketService: SocketService) {
    this.observeProviders().subscribe(providers => {
      if (providers && providers.length > 0) {
        this.state.selectedProviderId = providers[0].providerId;
        this.selectProvider(providers[0].providerId);
      }
      this.state.providers = providers;
    });

    this.observeProviderId().subscribe(providerId => {
      this.state.selectedProviderId = providerId;
    });

    this.observeApps().subscribe(apps => {
      this.state.apps = apps;
    });
  }

  observeProviders(): Observable<CheshireItunesconnectProvider[]> {
    return this.socketService.observeEvent('/cheshire/itunesconnect/providers').map(value => value as CheshireItunesconnectProvider[]);
  }

  observeProviderId(): Observable<string> {
    return this.socketService.observeValue('/cheshire/itunesconnect/providerId').map(value => value as string);
  }

  observeApps(): Observable<CheshireItunesconnectApp[]> {
    return this.socketService.observeEvent('/cheshire/itunesconnect/apps').map(value => value as CheshireItunesconnectApp[]);
  }

  observeReport(): Observable<any> {
    return this.socketService.observeEvent('/cheshire/itunesconnect/report');
  }

  refreshProviders() {
    this.socketService.sendEvent('/cheshire/itunesconnect/providers');
  }

  selectProvider(providerId: string) {
    this.state.selectedAppId = null;
    this.state.apps = [];
    this.socketService.sendEvent('/cheshire/itunesconnect/provider:set', providerId);
  }

  runReport(reportParameters) {
    this.socketService.sendEvent('/cheshire/itunesconnect/report', reportParameters);
  }
}
