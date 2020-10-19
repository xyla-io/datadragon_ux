import {Component, Input, OnInit, OnChanges, ElementRef, ViewChild} from '@angular/core';
import {SearchAdsReport, SearchAdsReportResult} from "../models/searchads";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MatPaginator, MatSort} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {SortService} from "../services/sort.service";
import {DataSource} from "@angular/cdk/collections";
import {CsvDownloaderService} from "../csv-downloader.service";

@Component({
  selector: 'app-searchads-reporting-results',
  templateUrl: './searchads-reporting-results.component.html',
  styleUrls: ['./searchads-reporting-results.component.css']
})
export class SearchadsReportingResultsComponent extends DataSource<SearchAdsReportResult> implements OnInit, OnChanges {

  public displayedColumns = [];
  public resultsDataChange: BehaviorSubject<SearchAdsReportResult[]> = new BehaviorSubject<SearchAdsReportResult[]>([]);
  private sortService: SortService<SearchAdsReportResult>;
  public _filterChange = new BehaviorSubject('');

  @Input() report: SearchAdsReport;
  public campaignNames = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private csvDownloaderService: CsvDownloaderService) {
    super();
    this.sortService = new SortService<SearchAdsReportResult>(((sortBy, a, b) => {
      return [a[sortBy], b[sortBy]];
    }));
  }

  ngOnInit() {
  }

  ngOnChanges() {
    switch (this.report.reportType) {
      case 'adgroup':
        this.displayedColumns = ['adGroupName', 'date', 'avgCPA', 'avgCPT', 'cpaGoal', 'conversionRate', 'conversions', 'impressions', 'defaultCpcBid', 'localSpend'];
        break;
      case 'keyword':
        this.displayedColumns = ['adGroupName', 'date', 'avgCPA', 'avgCPT', 'bidAmount', 'conversionRate', 'conversions', 'impressions', 'keyword', 'localSpend'];
        break;
      case 'searchterm':
        this.displayedColumns = ['adGroupName', 'date', 'avgCPA', 'avgCPT', 'conversionRate', 'conversions', 'impressions', 'keyword', 'localSpend', 'searchTermText', 'searchTermSource'];
        break;
      default: break;
    }

    this.campaignNames = Array.from(new Set(this.report.rows.map(row => row.campaignName))).join(", ");
    this.resultsDataChange.next(this.report.rows);
  }

  onFilterChange(event) {
    this._filterChange.next(event);
  }

  // DataSource<Rule> overrides
  connect(): Observable<SearchAdsReportResult[]> {
    const displayDataChanges = [
      this.resultsDataChange,
      this._filterChange,
      this.sort.sortChange,
      this.paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      var data = this.resultsDataChange.value.slice();
      data = this.filterData(data);
      data = this.sortData(data);

      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() {}

  filterData(data: SearchAdsReportResult[]): SearchAdsReportResult[] {
    return data.filter((result: SearchAdsReportResult) => {
      let searchStr = [result.campaignName, result.adGroupName].join(' ').toLowerCase();
      return searchStr.indexOf(this._filterChange.value.toLowerCase()) != -1;
    });
  }

  sortData(data: SearchAdsReportResult[]): SearchAdsReportResult[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return this.sortService.sortData(this.sort.active, this.sort.direction, data);
  }

  public _prettyReportName(reportType: string): string {
    switch (reportType) {
      case 'adgroup': return "Ad Groups";
      case 'keyword': return "Keywords";
      case 'searchterm': return "Search Terms";
      default: return "";
    }
  }

  public _prettyGranularity(granularity: string): string {
    switch (granularity) {
      case 'HOURLY': return 'Hourly';
      case 'DAILY': return 'Daily';
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
      default: return '';
    }
  }

  onDownloadCSV() {
    let filename = `${this.campaignNames}–${this._prettyReportName(this.report.reportType)} Report`;
    this.csvDownloaderService.downloadCSV(filename, this.report.rows);
  }
}
