import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { ApiService } from './api.service';
import { Credential, ChannelReportParameters } from '../models/credential';

@Injectable()
export class CredentialService {
  private credentialsURL = `${this.apiService.baseURL}/credentials`;
  private credentialsLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public credentialsObservable: Observable<Credential[]>;
  public credentials: Credential[] = [];

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
  ) {
    this.sessionService.session.subscribe(session => {
      if (!session) {
        this.clearCredentials();
        return;
      }
      console.log('refreshing credentials');
      this.refreshCredentials();
    });
    this.credentialsObservable = this.credentialsLoader.switchMap(shouldFetch => {
      if (!shouldFetch) { return Observable.of<Credential[]>([]); }
      return this.apiService.get(`${this.credentialsURL}`)
        .pipe(tap(response => console.log('credentials:', response.json())))
        .map(response => {
          this.credentials = response.json().credentials as Credential[];
          return this.credentials;
        });
    });
  }

  refreshCredentials() {
    this.credentialsLoader.next(true);
  }

  clearCredentials() {
    this.credentialsLoader.next(false);
  }

  createCredential(credential: Credential): Promise<Credential> {
    return this.apiService
      .post(this.credentialsURL, credential)
      .toPromise()
      .then(response => response.json() as Credential)
  }

  deleteCredentialByPath(credentialPath: string): Promise<null> {
    return this.apiService
      .delete(`${this.credentialsURL}/${credentialPath}`)
      .toPromise()
      .then(() => null)
  }

  getChannelReport(parameters: ChannelReportParameters): Promise<string> {
    return this.apiService
      .post(`${this.credentialsURL}/${parameters.credentialPath}/channel-report`, parameters)
      .toPromise()
      .then(response => response.json().report)
  }
}
