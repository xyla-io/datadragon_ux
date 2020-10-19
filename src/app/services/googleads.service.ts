import {SocketService} from './socket.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {ApiService} from './api.service';
import {
  AdwordsReportData,
  AdwordsReportParameters,
  AdwordsReportRowsData
} from '../models/googleads';

export interface GoogleadsCredentialData {
  _id?: string;
  credentialCreationDate?: string;
  name: string;
  developerToken?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  clientCustomerId?: number;
}

export class GoogleadsCredential {
  _id?: string;
  credentialCreationDate?: Date;
  name = '';
  developerToken?;
  clientId?;
  clientSecret?;
  refreshToken?;
  clientCustomerId?;

  constructor(data?: GoogleadsCredentialData) {
    if (!data) { return; }
    this._id = data._id;
    this.name = data.name;
    this.developerToken = data.developerToken;
    this.clientId = data.clientId;
    this.clientSecret = data.clientSecret;
    this.refreshToken = data.refreshToken;
    this.clientCustomerId = data.clientCustomerId;
    this.credentialCreationDate = (data.credentialCreationDate) ? new Date(data.credentialCreationDate) : undefined;
  }
}

@Injectable()
export class GoogleadsService {
  private googleadsURL = `${this.apiService.baseURL}/googleads`;

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private socketService: SocketService,
  ) {
    this.sessionService.session.subscribe(() => {
      this.clearCredentials();
    });
    this.credentialsObservable = this.credentialsLoader.switchMap(shouldFetch => {
      if (shouldFetch) {
        return this.apiService.get(`${this.googleadsURL}/credentials`)
          .map(response => {
            this.credentials = (response.json().credentials as GoogleadsCredentialData[])
              .map(credentialData => new GoogleadsCredential(credentialData) );
            return this.credentials;
          })
      } else {
        return Observable.of<GoogleadsCredential[]>([]);
      }
    })
  };

  private credentialsLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public credentials: GoogleadsCredential[] = [];
  public credentialsObservable: Observable<GoogleadsCredential[]>;

  createCredential(credential: GoogleadsCredential): Promise<GoogleadsCredential> {
    return this.apiService
      .post(`${this.googleadsURL}/credentials`, credential)
      .toPromise()
      .then(response => new GoogleadsCredential(response.json() as GoogleadsCredentialData))
  }

  deleteCredentialByID(credentialID: string): Promise<null> {
    return this.apiService
      .delete(`${this.googleadsURL}/credentials/${credentialID}`)
      .toPromise()
      .then(() => null)
  }

  refreshCredentials() {
    this.credentialsLoader.next(true);
  }

  clearCredentials() {
    this.credentialsLoader.next(false);
  }

  observeAdwordsReport(): Observable<AdwordsReportData> {
    return this.socketService.observeEvent('/googleads/report').map(value => value as AdwordsReportData);
  }

  observeAdwordsReportRows(): Observable<AdwordsReportRowsData> {
    return this.socketService.observeEvent('/googleads/report/rows').map(value => value as AdwordsReportRowsData);
  }

  observeAdwordsReportEnd(): Observable<any> {
    return this.socketService.observeEvent('/googleads/report/end');
  }

  runAdwordsReport(reportParameters: AdwordsReportParameters) {
    this.socketService.sendEvent('/googleads/report', reportParameters);
  }
}
