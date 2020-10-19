import { Injectable } from '@angular/core';
import { Campaign } from "../models/campaign"
import {Observable} from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {ApiService} from "./api.service";

@Injectable()
export class CampaignService {

  cachedCampaignsByAccount: Record<string, Campaign[]> = {};
  private campaignsURL = `${this.api.baseURL}/campaigns`;

  constructor(private api: ApiService) {}

  getCampaigns(account: string): Observable<Campaign[]> {
    if (this.cachedCampaignsByAccount[account]) {
      return of(this.cachedCampaignsByAccount[account]);
    }
    const url = `${this.campaignsURL}/${encodeURIComponent(account)}`;
    return this.api.get(url)
      .map(response => response.json().campaigns as Campaign[])
      .pipe(tap(campaigns => this.cachedCampaignsByAccount[account] = campaigns));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
