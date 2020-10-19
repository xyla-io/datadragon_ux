import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Rule } from '../models/rule';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {ApiService} from "./api.service";


export interface UpdateRule {
  id: string;
  shouldPerformAction?: boolean;
  shouldSendEmail?: boolean;
  isEnabled?: boolean;
  modified: Date;
}

@Injectable()
export class RuleService {
  private rulesURL = `${this.api.baseURL}/rules`;

  constructor(private api: ApiService) {}

  deleteByID(ruleID: string) {
    let url = `${this.rulesURL}/${ruleID}`;

    return this.api.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(rule: Rule): Promise<Rule> {
    return this.api
      .post(this.rulesURL, JSON.stringify(rule))
      .toPromise()
      .then(response => response.json().rule as Rule)
      .catch(this.handleError);
  }

  update(ruleUpdate: UpdateRule): Promise<Rule> {
    const url = `${this.rulesURL}/${ruleUpdate.id}`;

    return this.api
      .patch(url, JSON.stringify(ruleUpdate))
      .toPromise()
      .then(response => response.json().rule as Rule)
      .catch(this.handleError);
  }

  save(rule: Rule): Promise<Rule> {
    let url = `${this.rulesURL}/${rule._id}`;

    return this.api
      .put(url, JSON.stringify(rule))
      .toPromise()
      .then(response => response.json().rule as Rule)
      .catch(this.handleError);
  }

  getByID(ruleID: string): Promise<Rule> {
    let url = `${this.rulesURL}/${ruleID}`;

    return this.api
      .get(url)
      .toPromise()
      .then(response => response.json().rule as Rule)
      .catch(this.handleError);
  }

  getRules(): Observable<Rule[]> {
    return this.api.get(this.rulesURL)
      .map(response => response.json().rules as Rule[]);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
