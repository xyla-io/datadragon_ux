import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import {RuleCondition} from "../models/rule";
import { CredentialTarget } from '../models/credential';

@Component({
  selector: 'app-edit-rule-condition',
  templateUrl: './edit-rule-condition.component.html',
  styleUrls: ['./edit-rule-condition.component.css']
})
export class EditRuleConditionComponent implements OnInit, OnChanges {
  @Input() condition: RuleCondition;
  @Input() channel: CredentialTarget;

  kpiOptions = [];

  kpiOptionPrefixMap = {
    'reavgCPA' : '$',
    'reavgCPT' : '$',
    'reavgCPM' : '$',
    'totalSpend' : '$',
  };

  kpiOptionSuffixMap = {
    'reavgTTR' : '%',
    'reavgConversionRate' : '%'
  };

  conditionalOptions = [{
    value: 'less',
    viewValue: 'Is less than',
  }, {
    value: 'greater',
    viewValue: 'Is greater than',
  }, {
    value: 'leq',
    viewValue: 'Is at most',
  }, {
    value: 'geq',
    viewValue: 'Is at least',
  }, {
    value: 'equal',
    viewValue: 'Is equal to',
  }];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.channel) {
      switch (this.channel) {
        case CredentialTarget.AppleSearchAds:
        case CredentialTarget.GoogleAds:
        case CredentialTarget.Snapchat:
          this.kpiOptions = [{
            value: 'reavgCPA',
            viewValue: 'CPA',
            prefix: '$',
          }, {
            value: 'reavgCPT',
            viewValue: 'CPT',
            prefix: '$',
          }, {
            value: 'reavgCPM',
            viewValue: 'CPM',
            prefix: '$',
          }, {
            value: 'totalSpend',
            viewValue: 'Spend',
            prefix: '$',
          }, {
            value: 'totalImpressions',
            viewValue: 'Impressions',
          }, {
            value: 'totalTaps',
            viewValue: 'Taps',
          }, {
            value: 'totalConversions',
            viewValue: 'Conversions',
          }, {
            value: 'reavgTTR',
            viewValue: 'TTR',
            suffix: '%',
          }, {
            value: 'reavgConversionRate',
            viewValue: 'CR',
            suffix: '%',
          }];
        break;
      }
    }

    if (this.condition && !this.kpiOptions.map(option => option.value).includes(this.condition.metric)) {
      this.condition.metric = this.kpiOptions[0].value;
    }
  }
}
