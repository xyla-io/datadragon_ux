import { Component, OnInit } from '@angular/core';
import {SearchadsReportService} from "../services/searchads-report.service";
import {SearchAdsReport} from "../models/searchads";

export interface SearchadsReportParameters {
  accountIDs: string[];
  campaignID?: number;
  campaignIDs: number[];
  adgroupID?: number;
  adGroupIDs: number[];
  reportType: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-searchads-reporting',
  templateUrl: './searchads-reporting.component.html',
  styleUrls: ['./searchads-reporting.component.css']
})
export class SearchadsReportingComponent implements OnInit {

  public reportDataArray: SearchAdsReport[] = [];
  public showProgressBar = false;

  constructor(private searchAdsReportService: SearchadsReportService) { }

  ngOnInit() {
    this.searchAdsReportService.observeReport().subscribe(report => {
      this.reportDataArray.unshift(report);
      console.log(report);
    });

    this.searchAdsReportService.observeReportEnd().subscribe(() => {
      this.showProgressBar = false;
    });
  }

  onReportParametersEmitted(parameters: SearchadsReportParameters) {
    this.showProgressBar = true;
    this.searchAdsReportService.runReport(parameters);
  }
}
