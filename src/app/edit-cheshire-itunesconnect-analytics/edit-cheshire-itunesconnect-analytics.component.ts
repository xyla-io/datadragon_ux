import { Component, OnInit } from '@angular/core';
import {CheshireItunesconnectService} from "../services/cheshire-itunesconnect.service";
import {MobileactionService} from "../services/mobileaction.service";

@Component({
  selector: 'app-edit-cheshire-itunesconnect-analytics',
  templateUrl: './edit-cheshire-itunesconnect-analytics.component.html',
  styleUrls: ['./edit-cheshire-itunesconnect-analytics.component.css']
})
export class EditCheshireItunesconnectAnalyticsComponent implements OnInit {

  public selectedAppId?: string = null;

  public availableRegions: string[] = [];
  public selectedRegions = [];

  constructor(
    public itunesConnectService: CheshireItunesconnectService,
    private mobileActionService: MobileactionService,
  ) {
    this.itunesConnectService.observeApps().subscribe(apps => {
      console.log(apps);
      if (apps.length > 0) {
        this.selectedRegions = [];
        this.availableRegions = [];
        this.mobileActionService.getAppDetails(apps[0].adamId).then((details) => {
          this.availableRegions = details.countryList;
          let allOption = "All Regions";
          this.availableRegions.unshift(allOption);
          this.selectedRegions = [allOption];
        });
      }
      return this.selectedAppId = apps.length > 0 ? apps[0].adamId : null
    });

    this.itunesConnectService.observeReport().subscribe(data => {
      console.log(data);
    });

    this.mobileActionService.getAppDetails("1062059167").then(details => console.log(details));
  }

  ngOnInit() {
    this.itunesConnectService.refreshProviders()
  }

  onProviderChange(providerId) {
    if (providerId === null) { return }
    this.selectedAppId = null;
    this.itunesConnectService.selectProvider(providerId);
  }

  onRegionSelectionChanged(event) {
    console.log(this.selectedRegions);
  }

  onPlayButtonClicked() {
    console.log('Play!');
    console.log(this.selectedAppId);
    console.log(this.selectedRegions);

    this.itunesConnectService.runReport({
      start: '01/15/2018',
      end: '01/25/2018'
    });
  }
}
