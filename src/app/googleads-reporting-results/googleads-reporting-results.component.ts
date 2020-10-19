import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CsvDownloaderService} from "../csv-downloader.service";
import {SortService} from "../services/sort.service";
import {MatPaginator, MatSort} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {AdwordsReport, AdwordsReportResult} from "../models/googleads";
import {DataSource} from "@angular/cdk/collections";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-googleads-reporting-results',
  templateUrl: './googleads-reporting-results.component.html',
  styleUrls: ['./googleads-reporting-results.component.css']
})
export class GoogleadsReportingResultsComponent extends DataSource<AdwordsReportResult> implements OnInit, OnChanges, OnDestroy {

  public displayedColumns = [];
  public resultsDataChange: BehaviorSubject<AdwordsReportResult[]> = new BehaviorSubject<AdwordsReportResult[]>([]);
  private sortService: SortService<AdwordsReportResult>;
  public _filterChange = new BehaviorSubject('');
  private _progressSubscription?: Subscription;

  @Input() report: AdwordsReport;
  public campaignNames = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private csvDownloaderService: CsvDownloaderService) {
    super();
    this.sortService = new SortService<AdwordsReportResult>(((sortBy, a, b) => {
      return [a[sortBy], b[sortBy]];
    }));
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this._progressSubscription) { this._progressSubscription.unsubscribe() }
    this._progressSubscription = this.report.progressObservable.subscribe(progress => {
      console.log('progress change', this.report);
      this.resultsDataChange.next(this.report.rows);
    });
    switch (this.report.reportType) {
      case 'CRITERIA_PERFORMANCE_REPORT':
        this.displayedColumns = ['Day', 'Campaign', 'Ad group', 'Campaign ID', 'Ad group ID', 'Impressions', 'Clicks', 'Conversions', 'Cost'];
        break;
      case 'CAMPAIGN_PERFORMANCE_REPORT':
        this.displayedColumns = ['Day', 'Campaign', 'Campaign ID', 'Impressions', 'Clicks', 'Conversions', 'Cost', 'Target CPA'];
        break;
      default: break;
    }

    this.campaignNames = Array.from(new Set(this.report.rows.map(row => row['Camapign ID']))).join(", ");
  }

  onFilterChange(event) {
    this._filterChange.next(event);
  }

  // DataSource<Rule> overrides
  connect(): Observable<AdwordsReportResult[]> {
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

  filterData(data: AdwordsReportResult[]): AdwordsReportResult[] {
    return data.filter((result: AdwordsReportResult) => {
      let searchData: any[] = [];
      switch (this.report.reportType) {
        case 'CRITERIA_PERFORMANCE_REPORT':
          searchData = [result['Campaign'], result['Ad group']];
          break;
        case 'CAMPAIGN_PERFORMANCE_REPORT':
          searchData = [result['Campaign']];
          break;
        default: break;
      }
      return searchData.join(' ').toLowerCase().indexOf(this._filterChange.value.toLowerCase()) != -1;
    });
  }

  sortData(data: AdwordsReportResult[]): AdwordsReportResult[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return this.sortService.sortData(this.sort.active, this.sort.direction, data);
  }

  _prettyReportName(reportType: string): string {
    switch (reportType) {
      case 'CRITERIA_PERFORMANCE_REPORT': return "Criteria Performance";
      default: return "";
    }
  }

  onDownloadCSV() {
    let filename = `${this.campaignNames}–${this._prettyReportName(this.report.reportType)} Report`;
    this.csvDownloaderService.downloadCSV(filename, this.report.rows);
  }

  ngOnDestroy() {
    if (this._progressSubscription) { this._progressSubscription.unsubscribe() }
  }
}
