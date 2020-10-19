import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdgroupContext} from "../models/AdgroupContext";
import {AdgroupService} from "../services/adgroup.service";
import {Campaign} from "../models/campaign";
import {Certificate} from "../models/certificate";
import {CertificateService} from "../services/certificate.service";
import {Adgroup} from "../models/adgroup";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {CampaignService} from "../services/campaign.service";
import {SearchadsReportParameters} from "../searchads-reporting/searchads-reporting.component";
import {SearchadsReportService} from "../services/searchads-report.service";
import {SearchadsAccount, SearchadsAdGroup, SearchAdsCampaign} from "../models/searchads";

@Component({
  selector: 'app-edit-searchads-reporting',
  templateUrl: './edit-searchads-reporting.component.html',
  styleUrls: ['./edit-searchads-reporting.component.css']
})
export class EditSearchadsReportingComponent implements OnInit {
  public showSpinner: boolean = false;

  public selectedAccountIDs: string[] = [];
  public availableCampaigns: SearchAdsCampaign[] = [];
  public selectedCampaignIDs: number[] = [];
  public availableAdGroups: SearchadsAdGroup[] = [];
  public selectedAdGroupIDs: number[] = [];

  @Output() reportParametersEmitter = new EventEmitter<SearchadsReportParameters>();

  public reportParameters: SearchadsReportParameters = {
    reportType: 'adgroup',
    accountIDs: [],
    campaignIDs: [],
    adGroupIDs: [],
    startDate: new Date(),
    endDate: new Date()
  };

  public reportTypes = [{
    value: 'adgroup',
    viewValue: 'Ad Groups'
  }, {
    value: 'keyword',
    viewValue: 'Keywords'
  }, {
    value: 'searchterm',
    viewValue: 'Search Terms'
  }];

  maxDate = new Date();

  constructor(public searchadsReportService: SearchadsReportService) {}

  ngOnInit() {
    this.onAccountsChange();
    this.searchadsReportService.accountsObservable.subscribe((accounts) => {
      return this.onAccountsChange()
    });
    this.searchadsReportService.refreshAccounts();

    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    this.reportParameters.startDate = oneWeekAgo;
  }

  updateAccounts() {
    let availableAccountIDs = this.searchadsReportService.accounts.map(account => account.certificate._id);
    this.selectedAccountIDs = this.selectedAccountIDs.filter(id => availableAccountIDs.indexOf(id) !== -1);
    this.availableCampaigns = this.searchadsReportService.accounts.reduce((campaigns, account) => {
      if (!account.campaigns || this.selectedAccountIDs.indexOf(account.certificate._id) === -1) { return campaigns }
      return campaigns.concat(account.campaigns)
    }, []);
    let availableCampaignIDs = this.availableCampaigns.map(campaign => campaign.id);
    this.selectedCampaignIDs = this.selectedCampaignIDs.filter(id => availableCampaignIDs.indexOf(id) !== -1);
    this.availableAdGroups = this.availableCampaigns.reduce((adGroups, campaign) => {
      if (this.selectedCampaignIDs.indexOf(campaign.id) === -1) { return adGroups }
      return adGroups.concat(campaign.adGroups)
    }, []);
    let availableAdGroupIDs = this.availableAdGroups.map(adGroup => adGroup.id);
    this.selectedAdGroupIDs = this.selectedAdGroupIDs.filter(id => availableAdGroupIDs.indexOf(id) !== -1);

  }

  onAccountsChange() {
    if (this.searchadsReportService.accounts.length > 0 && this.selectedAccountIDs.length === 0) {
      this.selectedAccountIDs = [this.searchadsReportService.accounts[0].certificate._id];
    }
    this.onAccountIDsChange();
  }

  onAccountIDsChange() {
    this.searchadsReportService.accounts.forEach(account => {
      if (account.campaigns || this.selectedAccountIDs.indexOf(account.certificate._id) === -1) { return }
      this.searchadsReportService.refreshAccount(account.certificate._id)
    });
    this.updateAccounts();
  }

  onCampaignIDsChange() {
    this.updateAccounts();
  }

  onRunReportClicked() {
    this.reportParameters.accountIDs = this.selectedAccountIDs;
    this.reportParameters.campaignIDs = this.selectedCampaignIDs;
    this.reportParameters.adGroupIDs = this.selectedAdGroupIDs;
    console.log(this.reportParameters);
    this.reportParametersEmitter.emit(this.reportParameters);
  }
}
