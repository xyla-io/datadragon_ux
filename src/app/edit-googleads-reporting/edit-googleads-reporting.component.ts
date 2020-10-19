import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdwordsReportParameters} from "../models/googleads";
import {GoogleadsService} from "../services/googleads.service";

@Component({
  selector: 'app-edit-googleads-reporting',
  templateUrl: './edit-googleads-reporting.component.html',
  styleUrls: ['./edit-googleads-reporting.component.css']
})
export class EditGoogleadsReportingComponent implements OnInit {
  public showSpinner: boolean = false;

  @Output() reportParametersEmitter = new EventEmitter<AdwordsReportParameters>();

  public reportParameters: AdwordsReportParameters = {
    credentialId: null,
    reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
    startDate: new Date(),
    endDate: new Date(),
  };

  public reportTypes = [
    {
      value: 'CAMPAIGN_PERFORMANCE_REPORT',
      viewValue: 'Campaign Performance',
    },
    {
      value: 'CRITERIA_PERFORMANCE_REPORT',
      viewValue: 'Criteria Performance',
    },
  ];

  maxDate = new Date();

  constructor(public googleadsService: GoogleadsService) {}

  ngOnInit() {
    this.onAccountsChange();
    this.googleadsService.credentialsObservable.subscribe(() => {
      return this.onAccountsChange()
    });
    this.googleadsService.refreshCredentials();

    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    let threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    this.reportParameters.startDate = threeDaysAgo;
  }

  onAccountsChange() {
    if (this.googleadsService.credentials.length > 0 && this.reportParameters.credentialId === null) {
      this.reportParameters.credentialId = this.googleadsService.credentials[0]._id;
    }
  }

  onRunReportClicked() {
    console.log(this.reportParameters);
    this.reportParametersEmitter.emit(this.reportParameters);
  }
}
