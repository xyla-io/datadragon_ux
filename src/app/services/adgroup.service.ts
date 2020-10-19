import {Injectable} from '@angular/core';
import {Adgroup} from "../models/adgroup"
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {ApiService} from "./api.service";

@Injectable()
export class AdgroupService {

  private adgroupsURL = `${this.api.baseURL}/adgroups`;

  constructor(private api: ApiService) {}

  getAdgroups(account: string, orgID: number|string, campaignID: number|string): Observable<Adgroup[]> {
    const url = `${this.adgroupsURL}/${encodeURIComponent(account)}/${orgID}/${campaignID}`;
    return this.api.get(url)
      .map(response => response.json().adgroups as Adgroup[]);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
