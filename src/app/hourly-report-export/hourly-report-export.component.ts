import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Credential, CredentialTarget } from '../models/credential';
import { CredentialService } from '../services/credential.service';
import { CsvDownloaderService } from '../csv-downloader.service';

const _oneDayMilliseconds = 60 * 60 * 24 * 1000;
@Component({
  selector: 'app-hourly-report-export',
  templateUrl: './hourly-report-export.component.html',
  styleUrls: ['./hourly-report-export.component.css']
})
export class HourlyReportExportComponent implements OnInit, OnChanges {

  @Input() public credentialTarget: CredentialTarget;
  public credentials: Credential[] = [];
  public selectedCredential: Credential = {
    target: this.credentialTarget,
    name: 'Retrieving...'
  };

  public dataRangeOptions = [{
    displayName: '1 day',
    value: _oneDayMilliseconds
  }, {
    displayName: '2 days',
    value: _oneDayMilliseconds * 2
  }, {
    displayName: '3 days',
    value: _oneDayMilliseconds * 3
  }, {
    displayName: '4 days',
    value: _oneDayMilliseconds * 4
  }, {
    displayName: '5 days',
    value: _oneDayMilliseconds * 5
  }, {
    displayName: '6 days',
    value: _oneDayMilliseconds * 6
  }, {
    displayName: '7 days',
    value: _oneDayMilliseconds * 7
  }];
  public selectedDataRange = this.dataRangeOptions[0].value;;


  public entityGranularityOptions = [];
  public selectedEntityGranularity;
  public downloading: boolean = false;

  constructor(
    private credentialService: CredentialService,
    private csvDownloaderService: CsvDownloaderService
  ) { 
  }

  ngOnInit() {
    this.credentialService.credentialsObservable
      .subscribe(credentials => {
        this.credentials = credentials
          .filter(credential => credential.target === this.credentialTarget);
        if (this.credentials) {
          this.selectedCredential = this.credentials[0];
        }
      });
  }

  ngOnChanges() {
    switch (this.credentialTarget) {
      case CredentialTarget.GoogleAds:
        this.entityGranularityOptions = [{
          displayName: 'Campaign',
          value: 'campaign'
        }, {
          displayName: 'Ad Group',
          value: 'adgroup'
        }];    
        break;
      case CredentialTarget.AppleSearchAds:
        this.entityGranularityOptions = [{
          displayName: 'Campaign',
          value: 'campaign'
        }, {
          displayName: 'Ad Group',
          value: 'adgroup'
        }, {
          displayName: 'Keyword',
          value: 'ad'
        }];    
        break;
      case CredentialTarget.Snapchat:
        this.entityGranularityOptions = [{
          displayName: 'Campaign',
          value: 'campaign'
        }, {
          displayName: 'Ad Squad',
          value: 'adgroup'
        }, {
          displayName: 'Ad',
          value: 'ad'
        }];    
        break;
      default:
        this.entityGranularityOptions = [{
          displayName: 'Campaign',
          value: 'campaign'
        }, {
          displayName: 'Ad Group',
          value: 'adgroup'
        }, {
          displayName: 'Ad',
          value: 'ad'
        }];    
    }
    this.selectedEntityGranularity =  this.entityGranularityOptions[0].value;
  }
  
  export() {
    const now = new Date()
    const start = new Date(now.getTime() - this.selectedDataRange);
    const params = {
      credentialPath: this.selectedCredential.path,
      timeGranularity: 'hourly',
      entityGranularity: this.selectedEntityGranularity,
      start: start,
      end: now
    };
    this.downloading = true;
    this.credentialService.getChannelReport(params)
      .then(response => {
        const filename = `${this.selectedCredential.name}__${this.selectedCredential.target}s__${this.selectedEntityGranularity}__${this._dateString(start)}__to__${this._dateString(now)}`;
        this.csvDownloaderService.downloadCSVString(`${filename}`, response);
        this.downloading = false;
      });
  }

  _dateString(date: Date) {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
