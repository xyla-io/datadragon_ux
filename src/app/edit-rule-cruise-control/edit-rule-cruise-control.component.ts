import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {RuleTask} from "../models/rule";
import { CredentialTarget } from '../models/credential';

@Component({
  selector: 'app-edit-rule-cruise-control',
  templateUrl: './edit-rule-cruise-control.component.html',
  styleUrls: ['./edit-rule-cruise-control.component.css']
})
export class EditRuleCruiseControlComponent implements OnInit, OnChanges {
  public metric: string;
  public max: number;
  public min: number;

  @Input() channel: CredentialTarget;
  @Input() tasks: RuleTask[];

  constructor() { }

  kpiOptions = [{
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

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onMetricChange(this.tasks[0].conditionGroup.conditions[0].metric);
    this.onMaxChange(this.tasks[0].conditionGroup.conditions[0].metricValue);
    this.onMinChange(this.tasks[2].conditionGroup.conditions[0].metricValue);
    if (changes.channel) {
      this.onChannelChange(changes.channel);
    }
  }

  onChannelChange(change: SimpleChange) {
    if (change.firstChange || change.currentValue === change.previousValue) { return; }
    switch (this.channel) {
      case CredentialTarget.AppleSearchAds:
        this.tasks[0].actions = [{
          action: 'dec_bid',
          adjustmentValue: 10,
          adjustmentLimit: 1.75,
        }];
        this.tasks[2].actions = [{
          action: 'inc_bid',
          adjustmentValue: 10,
          adjustmentLimit: 3.5,
        }];
        break;
      case CredentialTarget.GoogleAds:
      case CredentialTarget.Snapchat:
        this.tasks[0].actions = [{
          action: 'pause_campaign',
          adjustmentValue: 0,
          adjustmentLimit: 0,
        }];
        this.tasks[2].actions = [{
          action: 'pause_campaign',
          adjustmentValue: 0,
          adjustmentLimit: 0,
        }];
        break;
      }
  }

  onMetricChange(metric: string) {
    this.metric = metric;
    this.tasks.forEach(task => {
      task.conditionGroup.conditions.forEach(condition => {
        condition.metric = metric;
      });
    });
  }

  onMaxChange(max: number) {
    this.max = max;
    this.tasks[0].conditionGroup.conditions[0].metricValue = max;
    this.tasks[1].conditionGroup.conditions[0].metricValue = max;
  }

  onMinChange(min: number) {
    this.min = min;
    this.tasks[2].conditionGroup.conditions[0].metricValue = min;
    this.tasks[1].conditionGroup.conditions[1].metricValue = min;
  }

}
