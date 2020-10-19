import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdwordsReport, AdwordsReportParameters} from "../models/googleads";
import {GoogleadsService} from "../services/googleads.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-googleads-reporting',
  templateUrl: './googleads-reporting.component.html',
  styleUrls: ['./googleads-reporting.component.css']
})
export class GoogleadsReportingComponent implements OnInit, OnDestroy {

  public reportDataArray: AdwordsReport[] = [];
  public showProgressBar = false;
  private reportSubscription: Subscription;
  private reportEndSubscription: Subscription;
  private reportRowsSubscription: Subscription;

  constructor(private googleadsService: GoogleadsService) { }

  ngOnInit() {
    this.reportSubscription = this.googleadsService.observeAdwordsReport().subscribe(reportData => {
      let report = new AdwordsReport(reportData);
      this.reportDataArray.unshift(report);
      console.log(report);
    });

    this.reportRowsSubscription = this.googleadsService.observeAdwordsReportRows().subscribe(reportRows => {
      console.log('report rows received', reportRows);
      this.reportDataArray
        .filter(report => report.reportId === reportRows.reportId)
        .forEach(report => report.addRowsData(reportRows.rows));
    });

    this.reportEndSubscription = this.googleadsService.observeAdwordsReportEnd().subscribe(() => {
      this.showProgressBar = false;
    });
  }

  onReportParametersEmitted(parameters: AdwordsReportParameters) {
    this.showProgressBar = true;
    this.googleadsService.runAdwordsReport(parameters);
  }

  ngOnDestroy() {
    this.reportSubscription.unsubscribe();
    this.reportEndSubscription.unsubscribe();
    this.reportRowsSubscription.unsubscribe();
  }

}
