import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Rule} from "../models/rule";
import {SearchadsReportService} from "../services/searchads-report.service";
import {Subscription} from "rxjs/Subscription";
import {SearchadsReportParameters} from "../searchads-reporting/searchads-reporting.component";
import {SearchadsImpactReportParameters, SearchAdsImpactReport, SearchAdsImpactReportResult} from "../models/searchads";
import {CsvDownloaderService} from "../csv-downloader.service";
import {PlotlyService} from "../services/plotly.service";

interface ImpactTotals {
  cpa?: number;
  conversions: number;
  spend: number;
}

interface ImpactRow {
  name: string;
  before?: number;
  after?: number;
  delta?: number;
  numberFormat: string;
  invertsDeltaColor: boolean;
}

@Component({
  selector: 'app-rule-impact',
  templateUrl: './rule-impact.component.html',
  styleUrls: ['./rule-impact.component.css']
})
export class RuleImpactComponent implements OnInit, OnChanges, OnDestroy {

  @Input() rule: Rule;
  @ViewChild('graph') graphElement: ElementRef;
  private creationDay: Date;
  private reportSubscription: Subscription;
  private reportRowsSubscription: Subscription;
  private reportEndSubscription: Subscription;
  public totalActions: number = null;
  private beforeInterval: string;
  private afterInterval: string;
  public impactRows?: ImpactRow[];
  public showsSpinner: boolean = false;
  private dayInterval: number;
  private reportParameters?: SearchadsImpactReportParameters;
  private report?: SearchAdsImpactReport;

  constructor(
    private searchadsReportService: SearchadsReportService,
    private csvDownloaderService: CsvDownloaderService,
    private plotlyService: PlotlyService,
  ) {
    this.reportSubscription = this.searchadsReportService.observeImpactReport()
      .subscribe(reportData => {
        console.log('impact report', reportData);
        if (reportData.reportId !== this.reportParameters.reportId) return;
        this.report = new SearchAdsImpactReport(reportData);
      });
    this.reportRowsSubscription = this.searchadsReportService.observeImpactReportRows()
      .subscribe(rowsData => {
        console.log('impact report rows', rowsData);
        if (rowsData.reportId !== this.report.reportId) return;
        this.report.addRowsData(rowsData.rows);
      });
    this.reportEndSubscription = this.searchadsReportService.observeImpactReportEnd()
      .subscribe(() => {
        console.log('impact end');
        this._showImpact();
        this.showsSpinner = false;
      });
  }

  ngOnChanges() {
    console.log('Running impact report', this.rule);
    this.reportParameters = {
      ruleId: this.rule._id,
    };
    let creationDate =  new Date(this.rule.created as any as string);
    this.creationDay = new Date(Date.UTC(creationDate.getUTCFullYear(), creationDate.getUTCMonth(), creationDate.getUTCDate()));
    this.searchadsReportService.runImpactReport(this.reportParameters);
    this.showsSpinner = true;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.reportSubscription.unsubscribe();
    this.reportRowsSubscription.unsubscribe();
    this.reportEndSubscription.unsubscribe();
  }

  _showImpact() {

    this.showsSpinner = false;
    this.totalActions = this.report.rows.map(row => { return row.actions }).reduce((a, b) => { return a + b }, 0)
    if (this.report.rows.length === 0) return;

    let beforeRows = this._beforeRows(this.report);
    let afterRows = this._afterRows(this.report);
    console.log('Impact report', this.report);
    console.log('Before rows', beforeRows);
    console.log('After rows', afterRows);

    let intervalSuffix: string
    switch (this.report.granularity) {
      case 'DAILY': intervalSuffix = 'Days'; break;
      case 'WEEKLY': intervalSuffix = 'Weeks'; break;
      case 'MONTHLY': intervalSuffix = 'Months'; break;
    }
    
    this.beforeInterval = `${beforeRows.length} ${intervalSuffix}`
    this.afterInterval = `${afterRows.length} ${intervalSuffix}`

    let beforeTotals: ImpactTotals = this._impactTotals(beforeRows);
    let afterTotals: ImpactTotals = this._impactTotals(afterRows);

    function _impactRow(name: string, property: string, numberFormat: string = '1.2', invertsDeltaColor: boolean = false): ImpactRow {
      let row: ImpactRow = {
        name: name,
        before: beforeTotals[property],
        after: afterTotals[property],
        numberFormat: numberFormat,
        invertsDeltaColor: invertsDeltaColor,
      };
      if (row.before !== undefined && row.after !== undefined) {
        row.delta = row.after - row.before;
      }
      return row;
    }

    this.impactRows = [
      _impactRow('Spend', 'spend', '1.2', true),
      _impactRow('Conversions', 'conversions', '1.0'),
      _impactRow('Avg. CPA', 'cpa', '1.2', true),
    ];

    let plots = this._impactPlots(this.report.rows as SearchAdsImpactReportResult[]);
    this.plotlyService.Plotly.plot(this.graphElement.nativeElement, plots, {
      margin: { t: 0 },
      shapes: [
        {
          type: 'line',
          x0: this.rule.created,
          y0: 0,
          x1: this.rule.created,
          y1: 1,
          yref: 'paper',
          line: {
              color: 'gray',
              width: 1,
              dash: 'dot',
          },
        },
      ],
    });
  }

  _impactTotals(rows: SearchAdsImpactReportResult[]): ImpactTotals {
    let totals: ImpactTotals = {
      conversions: 0,
      spend: 0,
    };
    rows.forEach(row => {
      totals.conversions += row.conversions;
      totals.spend += row.localSpend;
    });
    if (totals.conversions > 0) {
      totals.cpa = totals.spend / totals.conversions;
    }
    return totals;
  }

  _impactPlots(rows: SearchAdsImpactReportResult[]): Plotly.Data[] {
    rows.sort((a, b) => { return a.date.getTime() - b.date.getTime() });

    let spend = {
      name: 'Spend',
      x: [],
      y: [],
    };
    let conversions = {
      name: 'Conversions',
      x: [],
      y: [],
    };
    let actions = {
      name: 'Actions',
      x: [],
      y: [],
    };
    let middleRowIndex = Math.floor(rows.length / 2);
    let totalSpend = 0;
    let totalConversions = 0;
    let totalActions = 0;
    var date = null;

    function _addDatum() {
      spend.x.push(date);
      spend.y.push(totalSpend);
      conversions.x.push(date);
      conversions.y.push(totalConversions);
      actions.x.push(date);
      actions.y.push(totalActions);
    }

    rows.forEach((row, index) => {
      if (row.date !== date && index > 0) { _addDatum(); }
      date = row.date;
      totalSpend += row.localSpend;
      totalConversions += row.conversions;
      totalActions += row.actions;
    });
    if (rows.length > 0) { _addDatum() };

    return [spend, conversions, actions];
  }

  _beforeRows(report): SearchAdsImpactReportResult[] {
    switch (report.granularity) {
      case 'HOURLY':
      case 'DAILY':
        return report.rows.filter(row => row.date < this.creationDay) as SearchAdsImpactReportResult[];
      case 'WEEKLY':
        let creationWeek = new Date(this.creationDay);
        creationWeek.setDate(creationWeek.getUTCDate() -  creationWeek.getUTCDay());
        console.log('creation week', creationWeek);
        return report.rows.filter(row => row.date < creationWeek) as SearchAdsImpactReportResult[];
      case 'MONTHLY':
        let creationMonth = this.creationDay.getUTCMonth();
        return report.rows.filter(row => row.getUTCMonth() < creationMonth) as SearchAdsImpactReportResult[];
      default: return [];
    }
  }

  _afterRows(report): SearchAdsImpactReportResult[] {
    switch (report.granularity) {
      case 'HOURLY':
        let dayAfterCreation = new Date(this.creationDay);
        dayAfterCreation.setDate(dayAfterCreation.getUTCDate() + 1);
        return report.rows.filter(row => row.date >= dayAfterCreation) as SearchAdsImpactReportResult[];
      case 'DAILY': return report.rows.filter(row => row.date > this.creationDay) as SearchAdsImpactReportResult[];
      case 'WEEKLY':
        let creationWeek = new Date(this.creationDay);
        creationWeek.setDate(creationWeek.getUTCDate() -  creationWeek.getUTCDay() + 7);
        return report.rows.filter(row => row.date >= creationWeek) as SearchAdsImpactReportResult[];
      case 'MONTHLY':
        let creationMonth = this.creationDay.getUTCMonth();
        return report.rows.filter(row => row.getUTCMonth() > creationMonth) as SearchAdsImpactReportResult[];
      default: return [];
    }
  }

  private onDownloadCSV() {
    if (!this.report) { return }
    let filename = `${this.rule.metadata.title || this.rule.metadata.description}–Impact`;
    this.csvDownloaderService.downloadCSV(filename, this.report.rows);
  }
}
