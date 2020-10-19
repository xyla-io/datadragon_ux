import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {SessionService} from "./session.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SocketService} from "./socket.service";
import {Observable} from "rxjs/Observable";
import {Adgroup} from "../models/adgroup";

export interface AdjustCredentialData {
  _id?: string;
  credentialCreationDate?: string;
  name: string;
  userToken?: string;
  appToken?: string;
  lastRevenueReportDate?: string;
}

export class AdjustCredential {
  _id?: string;
  credentialCreationDate?: Date;
  name: string = '';
  userToken?;
  appToken?;
  lastRevenueReportDate?: Date;

  constructor();
  constructor(data: AdjustCredentialData);
  constructor(data?: AdjustCredentialData) {
    if (!data) { return }
    this._id = data._id;
    this.name = data.name;
    this.userToken = data.userToken;
    this.appToken = data.appToken;
    this.lastRevenueReportDate = (data.lastRevenueReportDate) ? new Date(data.lastRevenueReportDate) : undefined;
    this.credentialCreationDate = (data.credentialCreationDate) ? new Date(data.credentialCreationDate) : undefined;
  }
}

export interface AdjustRevenueReportParameters {
  credentialID: string;
  period: string;
  startDate: Date;
}

export class AdjustRevenueReport {
  name: string;
  runDate: Date;
  parameters: AdjustRevenueReportParameters;
  rows: string;
  get startDate(): Date { return this.parameters.startDate }
  get startDateDescription(): string { return this.dateDescription(this.startDate) }
  get runDateDescription(): string { return this.dateDescription(this.runDate) }

  constructor(name: string, runDate: Date, parameters: AdjustRevenueReportParameters, rows: string) {
    this.name = name;
    this.runDate = runDate;
    this.parameters = parameters;
    this.rows = rows;
  }

  private dateDescription(date?: Date): string {
    if (!date) { return '' }
    return `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${('00' + date.getDate()).slice(-2)}`;  }
}

@Injectable()
export class AdjustService {
  private adjustURL = `${this.apiService.baseURL}/adjust`;

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
        return this.apiService.get(`${this.adjustURL}/credentials`)
          .map(response => {
            this.credentials = (response.json().credentials as AdjustCredentialData[])
              .map(credentialData => new AdjustCredential(credentialData) );
            return this.credentials;
          })
      } else {
        return Observable.of<AdjustCredential[]>([]);
      }
    })
  };

  private credentialsLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public credentials: AdjustCredential[] = [];
  public credentialsObservable: Observable<AdjustCredential[]>;

  createCredential(credential: AdjustCredential): Promise<AdjustCredential> {
    return this.apiService
      .post(`${this.adjustURL}/credentials`, credential)
      .toPromise()
      .then(response => new AdjustCredential(response.json() as AdjustCredentialData))
  }

  deleteCredentialByID(credentialID: string): Promise<null> {
    return this.apiService
      .delete(`${this.adjustURL}/credentials/${credentialID}`)
      .toPromise()
      .then(() => null)
  }

  refreshCredentials() {
    this.credentialsLoader.next(true);
  }

  clearCredentials() {
    this.credentialsLoader.next(false);
  }

  getRevenueReport(reportParameters: AdjustRevenueReportParameters): Promise<AdjustRevenueReport> {
    let matchingCredentials = this.credentials.filter(credential => credential._id === reportParameters.credentialID)
    matchingCredentials.forEach(credential => {
      credential.lastRevenueReportDate = reportParameters.startDate;
    });
    let name = (matchingCredentials.length > 0) ? matchingCredentials[0].name : reportParameters.credentialID;
    let runDate = new Date();
    let parameters = Object.assign({}, reportParameters);
    return this.socketService.get('/adjust/revenue/report', reportParameters)
      .then(rows => {
        return new AdjustRevenueReport(name, runDate, parameters, rows);
      });
  }
}
