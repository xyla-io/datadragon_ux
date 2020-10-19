import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {RuleAction} from "../models/rule";
import {FormControl, FormGroupDirective, NgForm, Validators, ReactiveFormsModule} from '@angular/forms';
import {ErrorStateMatcher} from "@angular/material/core";
import { CredentialTarget } from '../models/credential';

/** Error when invalid control is dirty, touched, or submitted. */
export class AdjustmentLimitErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-rule-action',
  templateUrl: './edit-rule-action.component.html',
  styleUrls: ['./edit-rule-action.component.css']
})
export class EditRuleActionComponent implements OnInit, OnChanges {

  @Input() channel: CredentialTarget;
  @Input() action: RuleAction;

  adjustmentLimitFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new AdjustmentLimitErrorStateMatcher();

  actions = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.channel === undefined) {
      return
    }

    switch (this.channel) {
      case CredentialTarget.AppleSearchAds:
        this.actions = [
          {
            viewValue: 'Increase Bid',
            value: 'inc_bid'
          }, {
            viewValue: 'Decrease Bid',
            value: 'dec_bid'
          }, {
            viewValue: 'Increase CPA Goal',
            value: 'inc_cpa_goal'
          }, {
            viewValue: 'Decrease CPA Goal',
            value: 'dec_cpa_goal'
          }, {
            viewValue: 'Pause Keyword',
            value: 'pause_keyword'
          }, {
            viewValue: 'No Action',
            value: 'no_action'
          }
        ];
        break;
      case CredentialTarget.GoogleAds:
        this.actions = [
          {
            viewValue: 'Increase Campaign Target CPA',
            value: 'inc_cpa_goal_campaign'
          }, {
            viewValue: 'Decrease Campaign Target CPA',
            value: 'dec_cpa_goal_campaign'
          }, {
            viewValue: 'Pause Campaign',
            value: 'pause_campaign'
          }, {
            viewValue: 'Increase Campaign Budget',
            value: 'increase_campaign_budget'
          }, {
            viewValue: 'Decrease Campaign Budget',
            value: 'decrease_campaign_budget'
          },
        ];
        break;
      case CredentialTarget.Snapchat:
        this.actions = [
          {
            viewValue: 'Pause Campaign',
            value: 'pause_campaign'
          }, {
            viewValue: 'Increase Campaign Budget',
            value: 'increase_campaign_budget'
          }, {
            viewValue: 'Decrease Campaign Budget',
            value: 'decrease_campaign_budget'
          },
        ];
        break;
    }
  }
}
