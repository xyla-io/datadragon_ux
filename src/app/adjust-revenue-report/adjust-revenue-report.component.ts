import { Component, OnInit, Input } from '@angular/core';
import {CsvDownloaderService} from "../csv-downloader.service";
import {AdjustRevenueReport} from "../services/adjust.service";

@Component({
  selector: 'app-adjust-revenue-report',
  templateUrl: './adjust-revenue-report.component.html',
  styleUrls: ['./adjust-revenue-report.component.css']
})
export class AdjustRevenueReportComponent implements OnInit {

  constructor(
    private csvDownloaderService: CsvDownloaderService,
  ) { }

  @Input() report: AdjustRevenueReport;

  ngOnInit() {
  }

  onDownloadCSV() {
    if (!this.report) { return }
    let filename = `${this.report.name}-Adjust–Revenue-${this.report.startDateDescription}-to-${this.report.runDateDescription}`;
    this.csvDownloaderService.downloadCSVString(filename, this.report.rows);
  }
}
