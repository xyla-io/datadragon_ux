import {Subject} from "rxjs/Subject";

export interface AdwordsReportParameters {
  credentialId?: string;
  reportType: string;
  startDate: Date;
  endDate: Date;
}

export interface AdwordsCampaignData {
  id: number;
  name: string;
  status: string;
  targetCpa?: number;
}

export interface AdwordsReportData {
  reportId: string;
  reportType: string;
  startDate: number;
  endDate: number;
  campaigns: AdwordsCampaignData[];
}

export class AdwordsReport {
  reportId: string;
  name: string;
  reportType: string;
  startDate: Date;
  endDate: Date;
  campaigns: AdwordsCampaignData[];
  rows: AdwordsReportResult[] = [];
  get startDateDescription(): string { return this.dateDescription(this.startDate) }
  get endDateDescription(): string { return this.dateDescription(this.endDate) }

  progress: number = 0;
  progressObservable: Subject<number> = new Subject<number>();

  constructor(reportData: AdwordsReportData) {
    this.reportId = reportData.reportId;
    this.reportType = reportData.reportType;
    this.startDate = new Date(reportData.startDate * 1000);
    this.endDate = new Date(reportData.endDate * 1000);
    this.campaigns = [];
    reportData.campaigns.forEach(campaign => {
      this.campaigns[campaign.id] = campaign;
    });
  }

  public addRowsData(data: AdwordsReportResultData[]) {
    data.forEach(rowData => {
      let anyRow = rowData as any;
      anyRow.Campaign = (rowData['Campaign ID'] &&  this.campaigns[rowData['Campaign ID']]) ? this.campaigns[rowData['Campaign ID']].name : '';
      anyRow['Target CPA'] = (rowData['Campaign ID'] && this.campaigns[rowData['Campaign ID']] && this.campaigns[rowData['Campaign ID']].targetCpa) ? this.campaigns[rowData['Campaign ID']].targetCpa / 1000000 : 0;
      anyRow.Cost = (anyRow.Cost) ? anyRow.Cost / 1000000 : anyRow.Cost;
      this.rows.push(anyRow as AdwordsReportResult);
    });
    this.progress += 1;
    this.progressObservable.next(this.progress);
  }

  private dateDescription(date?: Date): string {
    if (!date) { return '' }
    return `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${('00' + date.getDate()).slice(-2)}`;  }
}

export interface AdwordsReportRowsData {
  reportId: string;
  rows: AdwordsReportResultData[];
}

export interface AdwordsReportResultData {
  'Campaign ID': number;
  Day: string;
}

export interface AdwordsReportResult {
  Campaign: string;
  'Campaign ID': number;
  Day: string;
}

export interface AdwordsCriteriaPerformanceReportResults extends AdwordsReportResult {
  'Ad group': string;
  'Ad group ID': number;
  Impressions: number;
  Clicks: number;
  Cost: number;
  Conversions: number;
  'Target CPA': number;
}

export interface AdwordsCampaignPerformanceReportResults extends AdwordsReportResult {
  Impressions: number;
  Clicks: number;
  Cost: number;
  Conversions: number;
  'Target CPA': number;
}

