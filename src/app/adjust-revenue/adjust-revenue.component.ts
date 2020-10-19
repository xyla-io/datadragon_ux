import { Component, OnInit } from '@angular/core';
import {AdjustRevenueReport, AdjustRevenueReportParameters, AdjustService} from "../services/adjust.service";

@Component({
  selector: 'app-adjust-revenue',
  templateUrl: './adjust-revenue.component.html',
  styleUrls: ['./adjust-revenue.component.css']
})
export class AdjustRevenueComponent implements OnInit {

  public reports: AdjustRevenueReport[] = [];

  constructor(
    private adjustService: AdjustService,
  ) { }

  ngOnInit() {
  }

  onReportParameters(reportParameters: AdjustRevenueReportParameters) {
    console.log('running report', reportParameters);
    this.adjustService.getRevenueReport(reportParameters).then(report => {
      this.reports.unshift(report);
    });
  }
}
