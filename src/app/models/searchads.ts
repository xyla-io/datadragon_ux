import {Certificate} from "./certificate";

export interface SearchadsAdGroup {
  id: number;
  name: string;
}

export interface SearchAdsCampaign {
  org_id: number;
  id: number;
  name: string;
  adGroups: SearchadsAdGroup[];
}

export interface SearchadsAccount {
  certificate: Certificate;
  campaigns?: SearchAdsCampaign[];
}

export interface SearchadsImpactReportParameters {
  reportId?: string;
  ruleId: string;
}

export interface SearchAdsReport {
  reportType: string;
  granularity: string;
  startDate: Date;
  endDate: Date;
  campaignID: string;
  rows: SearchAdsReportResult[];
}

export class SearchAdsImpactReport {
  reportId: string;
  granularity?: string;
  rows: SearchAdsImpactReportResult[];

  constructor(reportData: SearchAdsImpactReportData) {
    this.reportId = reportData.reportId;
    this.granularity = reportData.granularity;
    this.rows = [];
  }

  public addRowsData(data: SearchAdsImpactReportResultData[]) {
    data.forEach(rowData => {
      let anyRow = rowData as any;
      anyRow.date = new Date(rowData.date)
      this.rows.push(anyRow as SearchAdsImpactReportResult);
    });
  }
}

export interface SearchAdsImpactReportData {
  reportId: string;
  granularity: string;
}

export interface SearchAdsImpactReportRowsData {
  reportId: string;
  rows: SearchAdsImpactReportResultData[];
}

export interface SearchAdsImpactReportResult {
  date: Date;
  localSpend: number;
  conversions: number;
  actions: number;
}

export interface SearchAdsImpactReportResultData {
  date: string;
  localSpend: number;
  conversions: number;
  actions: number;
}

export interface SearchAdsReportResult {
  campaignName: string;
  adGroupName: string;
  date: Date;
}

export interface SearchAdsKeywordReportResults extends SearchAdsReportResult {
  avgCPA: number;
  avgCPT: number;
  bidAmount: number;
  conversionRate: number;
  conversions: number;
  impressions: number;
  keyword: string;
  localSpend: number;
}

export interface SearchAdsAdGroupReportResult extends SearchAdsReportResult {
  avgCPA: number;
  avgCPT: number;
  conversionRate: number;
  conversions: number;
  cpaGoal: number;
  defaultCpcBid: number;
  impressions: number;
  localSpend: number;
}

export interface SearchAdsSearchTermReportResult extends SearchAdsReportResult {
  avgCPA: number;
  avgCPT: number;
  conversionRate: number;
  conversions: number;
  impressions: number;
  keyword: string;
  localSpend: number;
  searchTermText: string;
  searchTermSource: string;
}

