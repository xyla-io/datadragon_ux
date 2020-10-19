import {Injectable} from '@angular/core';
import {RuleHistory} from "../models/rule-history"

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {ApiService} from "./api.service";

@Injectable()
export class RuleHistoryService {
  private rulesHistoryURL = `${this.api.baseURL}/rules/history`;

  constructor(private api: ApiService) {}

  getHistory(ruleID: string): Promise<RuleHistory[]> {
    const url = `${this.rulesHistoryURL}/${ruleID}`;
    return this.api.get(url)
      .toPromise()
      .then(response => response.json().history as RuleHistory[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
