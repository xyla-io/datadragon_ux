import { Injectable } from '@angular/core';
import {
  SearchadsAccount, SearchadsAdGroup, SearchAdsCampaign, SearchAdsImpactReportData, SearchadsImpactReportParameters,
  SearchAdsReport,
  SearchAdsImpactReportRowsData
} from "../models/searchads";
import {CertificateService} from "./certificate.service";
import {SessionService} from "./session.service";
import {SearchadsReportParameters} from "../searchads-reporting/searchads-reporting.component";
import {Observable} from "rxjs/Observable";
import {SocketService} from "./socket.service";
import {CampaignService} from "./campaign.service";
import {Subject} from "rxjs/Subject";
import { UUID } from 'angular2-uuid';

@Injectable()
export class SearchadsReportService {

  public accounts: SearchadsAccount[] = [];
  private accountsLoader: Subject<SearchadsAccount[]> = new Subject<SearchadsAccount[]>();
  public accountsObservable: Observable<SearchadsAccount[]>;

  constructor(
    private socketService: SocketService,
    private sessionService: SessionService,
    private certificateService: CertificateService,
    private campaignService: CampaignService,
  ) {
    this.sessionService.session.subscribe(() => this.clearAccounts());
    this.accountsObservable = this.accountsLoader.switchMap(accounts => {
      if (accounts === null) {
        return this.certificateService.getCertificates()
          .map(certificates => {
            this.accounts = certificates.map(certificate => { return { certificate: certificate }});
            return this.accounts;
          })
      } else {
        this.accounts = accounts;
        return Observable.of<SearchadsAccount[]>(accounts);
      }
    })

  }

  refreshAccounts() {
    this.accountsLoader.next(null);
  }

  refreshAccount(certificateID: string): Promise<SearchAdsCampaign[]> {
    return this.campaignService.getCampaigns(certificateID).toPromise().then(campaigns => {
      return campaigns as SearchAdsCampaign[];
    }).then(campaigns => {
      let accounts = this.accounts.filter(account => account.certificate._id === certificateID);
      if (accounts.length === 0) { return [] }
      accounts.forEach(account => account.campaigns = campaigns);
      this.accountsLoader.next(this.accounts);
      return campaigns;
    });
  }

  clearAccounts() {
    this.accountsLoader.next([]);
  }

  observeReport(): Observable<SearchAdsReport> {
    return this.socketService.observeEvent('/searchads/report').map(value => value as SearchAdsReport);
  }

  observeReportEnd(): Observable<any> {
    return this.socketService.observeEvent('/searchads/report/end');
  }

  runReport(reportParameters: SearchadsReportParameters) {
    this.socketService.sendEvent('/searchads/report', reportParameters);
  }

  observeImpactReportEnd(): Observable<any> {
    return this.socketService.observeEvent('/searchads/impact-report/end');
  }

  observeImpactReport(): Observable<SearchAdsImpactReportData> {
    return this.socketService.observeEvent('/searchads/impact-report').map(value => value as SearchAdsImpactReportData);
  }

  observeImpactReportRows(): Observable<SearchAdsImpactReportRowsData> {
    return this.socketService.observeEvent('/searchads/impact-report/rows').map(value => value as SearchAdsImpactReportRowsData);
  }

  runImpactReport(reportParameters: SearchadsImpactReportParameters): string {
    reportParameters.reportId = UUID.UUID()
    this.socketService.sendEvent('/searchads/impact-report', reportParameters);
    return reportParameters.reportId;
  }

}
