import {Component, EventEmitter, OnInit, Input, Output, OnChanges, OnDestroy} from '@angular/core';
import {Rule, RuleTask} from '../models/rule';
import {Campaign} from '../models/campaign';
import {Adgroup} from '../models/adgroup';
import {AdgroupContext} from '../models/AdgroupContext';
import {CampaignService} from '../services/campaign.service';
import {AdgroupService} from '../services/adgroup.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {RuleDescriptionPipe} from '../pipes/rule-description.pipe';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/first';
import {MatSnackBar} from '@angular/material';
import { Credential, CredentialTarget } from '../models/credential';
import {AdjustCredential, AdjustRevenueReportParameters, AdjustService} from '../services/adjust.service';
import {Subscription} from 'rxjs/Subscription';
import { Channel } from '../models/channel';
import { CredentialService } from '../services/credential.service';
import { RuleService } from '../services/rule.service';

export enum EditRuleAction {
  Save,
  Cancel,
  Close
}

enum EditRuleType {
  Simple,
  CruiseControl
}

@Component({
  selector: 'app-edit-rule',
  templateUrl: './edit-rule.component.html',
  styleUrls: ['./edit-rule.component.css']
})
export class EditRuleComponent implements OnInit, OnChanges, OnDestroy {
  private destroyed$ = new Subject();

  public channelOptions: Channel[] = [];
  public credentials: Credential[] = [];
  private campaignLoader: Subject<string> = new Subject<string>();
  private campaigns: Observable<Campaign[]> = Observable.of<Campaign[]>([]);
  public campaignOptions: Campaign[] = [];

  private adgroupLoader: Subject<AdgroupContext> = new Subject<AdgroupContext>();
  private adgroups: Observable<Adgroup[]> = Observable.of<Adgroup[]>([]);
  public adgroupOptions: Adgroup[] = [];


  private _selectedTabIndex: number;
  get selectedTabIndex(): number { return this._selectedTabIndex; }
  set selectedTabIndex(index: number) {
    this._selectedTabIndex = index;

    switch (index) {
      case 0:
        this.ruleType = EditRuleType.Simple;
        this.rule.tasks = this.simpleTasks;
        console.log('Simple rule: ', this.rule);
        break;
      case 1:
        this.ruleType = EditRuleType.CruiseControl;
        this.rule.tasks = this.cruiseControlTasks;
        console.log('Cruise control rule: ', this.rule);
        break;
    }
  }

  public EditRuleType = EditRuleType;
  public ruleType: EditRuleType = EditRuleType.Simple;
  public simpleTasks: RuleTask[];
  private cruiseControlTasks: RuleTask[];

  private shouldContinueEditing = false;

  @Input() inputRule: Rule;
  @Input() allowsSerialEditing = false;
  public rule: Rule;

  @Output() editActionEmitter = new EventEmitter<EditRuleAction>();
  public storedRulesByCampaign: Record<string, number> = {};

  // Properties
  runIntervals = [
    {value: 60 * 60 * 1000, viewValue: 'Every hour'},
    {value: 60 * 60 * 1000 * 4, viewValue: 'Every 4 hours'},
    {value: 60 * 60 * 1000 * 8, viewValue: 'Every 8 hours'},
    {value: 60 * 60 * 1000 * 12, viewValue: 'Every 12 hours'},
    {value: 60 * 60 * 1000 * 24, viewValue: 'Once a day'},
    {value: 60 * 60 * 1000 * 24 * 7, viewValue: 'Once a week'},
  ];

  granularityOptions = [
    {value: 'HOURLY', viewValue: 'Hourly'},
    {value: 'DAILY', viewValue: 'Daily'},
  ];

  rangeOptions = [];

  conditionGroupOperatorOptions = [{
    value: 'all',
    viewValue: 'If all of',
  }, {
    value: 'any',
    viewValue: 'If any of',
  }];

  constructor(
    private credentialService: CredentialService,
    private campaignService: CampaignService,
    private adgroupService: AdgroupService,
    public adjustService: AdjustService,
    private ruleService: RuleService
  ) {
  }

  ngOnInit() {
    this.startObservingCampaigns();
    this.startObservingAdgroups();
    this.retrieveChannels();
    this.setRangeOptions();

    this.adjustService.credentialsObservable
      .takeUntil(this.destroyed$)
      .subscribe(credentials => {
        if (credentials.length > 0) {
          // Temporary way of getting the adjust dropdown to autoselect the first credential we get back
          // We obviously shouldn't do this if the rule already has a credential selected
          this.rule['adjustCredential'] = credentials[0];
        }
      });

    if (this.adjustService.credentials.length === 0) {
      this.adjustService.refreshCredentials();
    }

    this.ruleService.getRules().subscribe(rules => {
      this.storedRulesByCampaign = rules.reduce((prev, rule) => {
        if (rule.isEnabled) {
          prev[rule.campaignID] = prev[rule.campaignID] ? prev[rule.campaignID] + 1 : 1;
        }
        return prev
      }, {});
    });
  }

  ngOnChanges() {
    console.log('Updated copied rule with: ', this.inputRule);
    this.rule = JSON.parse(JSON.stringify(this.inputRule));

    this.simpleTasks = this.simpleTasksWithRule(this.rule);
    this.cruiseControlTasks = this.cruiseControlTasksWithRule(this.rule);

    this.selectedTabIndex = this.inputRule.tasks.length === 3 ? 1 : 0;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private simpleTasksWithRule(rule) {
    if (rule.tasks.length === 1) { return rule.tasks; }

    return [JSON.parse(JSON.stringify(rule.tasks[0]))];
  }

  private cruiseControlTasksWithRule(rule) {
    if (rule.tasks.length === 3) { return rule.tasks; }

    const metric = rule.tasks[0].conditionGroup.conditions[0].metric;
    const metricValue = rule.tasks[0].conditionGroup.conditions[0].metricValue;
    return [{
      actions: [{
        action: 'dec_bid',
        adjustmentValue: 10,
        adjustmentLimit: metricValue * 0.5,
      }],
      conditionGroup: {
        conditions: [{
          metric: metric,
          metricValue: metricValue,
          operator: 'greater',
        }],
        operator: 'all',
        subgroups: [],
      }
    }, {
      actions: [{
        action: 'no_action',
        adjustmentValue: 0,
        adjustmentLimit: 0,
      }],
      conditionGroup: {
        conditions: [{
          metric: metric,
          metricValue: metricValue,
          operator: 'leq',
        }, {
          metric: metric,
          metricValue: metricValue * 0.5,
          operator: 'geq',
        }],
        operator: 'all',
        subgroups: [],
      }
    }, {
      actions: [{
        action: 'inc_bid',
        adjustmentValue: 10,
        adjustmentLimit: metricValue,
      }],
      conditionGroup: {
        conditions: [{
          metric: metric,
          metricValue: metricValue * 0.5,
          operator: 'less',
        }],
        operator: 'all',
        subgroups: [],
      }
    }];
  }

  private startObservingCampaigns() {
    this.campaigns = this.campaignLoader
      .switchMap(account => {
        return this.campaignService.getCampaigns(account).catch(err => {
          console.log('Error caught while loading campaigns', err);
          return [];
        });
      });
    this.campaigns.subscribe(campaigns => {
      this.campaignOptions = campaigns;
      if (campaigns.length > 0) {
        if (this.rule.campaignID === undefined) {
          this.rule.orgID = campaigns[0].org_id;
          this.rule.campaignID = campaigns[0].id;
        }
        this.reloadAdgroups();
      } else {
        this.rule.orgID = null;
        this.rule.campaignID = null;
      }
    });
  }

  private startObservingAdgroups() {
    this.adgroups = this.adgroupLoader.switchMap(adgroupContext => {
      if (adgroupContext.orgID !== null && adgroupContext.campaignID !== null) {
        return this.adgroupService.getAdgroups(adgroupContext.account, adgroupContext.orgID,  adgroupContext.campaignID)
          .map(adgroups => [{name: 'All', id: -1}].concat(adgroups));
      } else {
        return Observable.of<Adgroup[]>([]);
      }
    });
    this.adgroups.subscribe(adgroups => {
      this.adgroupOptions = adgroups;
      if (this.rule.channel !== CredentialTarget.AppleSearchAds && this.rule.adgroupID === undefined || this.rule.adgroupID === null) {
        this.rule.adgroupID = -1;
        return;
      }
      if (adgroups.length === 0) { return; }

      if (adgroups.length > 1) {
        if (this.rule.adgroupID === undefined) {
          this.rule.adgroupID = adgroups[1].id;
        } else if (this.rule.adgroupID === null) {
          this.rule.adgroupID = -1;
        }
      } else {
        this.rule.adgroupID = null;
      }
    });
  }

  private retrieveChannels() {
    this.channelOptions = [
      {
        identifier: CredentialTarget.AppleSearchAds,
        name: 'Apple',
      },
      {
        identifier: CredentialTarget.GoogleAds,
        name: 'Google',
      },
      {
        identifier: CredentialTarget.Snapchat,
        name: 'Snapchat',
      },
    ];
    if (this.rule.channel === undefined) {
      this.rule.channel = this.channelOptions[0].identifier;
    }
    this.retrieveAccounts();
  }

  private retrieveAccounts() {
    this.credentialService.credentialsObservable
      .first()
      .subscribe(credentials => {
        this.credentials = credentials
          .filter(credential => credential.target === this.rule.channel);
        if (this.credentials.length > 0) {
          if (this.rule.account === undefined) {
            this.rule.account = this.credentials[0].path;
          }
          this.reloadCampaigns();
        }
      });
  }

  reloadCampaigns() {
    this.campaignOptions = [];
    this.adgroupLoader.next({
      account: this.rule.account,
      orgID: null,
      campaignID: null
    });
    this.campaignLoader.next(this.rule.account);
  }

  reloadAdgroups() {
    this.adgroupOptions = [];
    this.adgroupLoader.next({
      account: this.rule.account,
      orgID: this.rule.orgID,
      campaignID: this.rule.campaignID
    });
  }

  setRangeOptions() {
    const googleSpecificOptions = [
      {
        value: 60 * 60 * 1000 * 24 * 30,
        viewValue: '30 days',
      },
    ]
    const snapchatSpecificOptions = [
      {
        value: 60 * 60 * 1000 * 24 * 30,
        viewValue: '30 days',
      },
    ]
    this.rangeOptions = [
      {
        value: 60 * 60 * 1000,
        viewValue: '1 hour',
      }, {
        value: 60 * 60 * 1000 * 4,
        viewValue: '4 hours',
      }, {
        value: 60 * 60 * 1000 * 12,
        viewValue: '12 hours',
      }, {
        value: 60 * 60 * 1000 * 24,
        viewValue: 'One day',
      }, {
        value: 60 * 60 * 1000 * 24 * 2,
        viewValue: 'Two days',
      }, {
        value: 60 * 60 * 1000 * 24 * 7,
        viewValue: 'One week',
      }
    ]
    if (this.rule) {
      switch (this.rule.channel) {
        case CredentialTarget.GoogleAds:
          this.rangeOptions.push(...googleSpecificOptions);
          break;
        case CredentialTarget.Snapchat:
          this.rangeOptions.push(...snapchatSpecificOptions);
          break;
        default:
          break;
      }
      if (!this.rangeOptions.map(option => option.value).includes(this.rule.dataCheckRange)) {
        console.log('had an invalid dataCheckRange value', this.rule.dataCheckRange);
        this.rule.dataCheckRange = this.rangeOptions[this.rangeOptions.length - 1].value;
      }
    }
  }

  onAdjustCredentialsChange() {
    console.log(this.rule);
  }

  onChannelChange() {
    this.rule.account = undefined;
    this.rule.orgID = undefined;
    this.rule.campaignID = undefined;
    this.rule.adgroupID = undefined;
    switch (this.rule.channel) {
      case CredentialTarget.AppleSearchAds:
        this.rule.tasks[0].actions = [{
          action: 'inc_bid',
          adjustmentValue: 20,
          adjustmentLimit: 3.5,
        }];
        delete this.rule.options.dynamic_window;
        break;
      case CredentialTarget.GoogleAds:
      case CredentialTarget.Snapchat:
        this.rule.tasks[0].actions = [{
          action: 'pause_campaign',
          adjustmentValue: 0,
          adjustmentLimit: 0,
        }];
        break;
    }
    this.setRangeOptions();
    this.retrieveAccounts();
  }

  onAccountChange() {
    this.rule.orgID = undefined;
    this.rule.campaignID = undefined;
    this.rule.adgroupID = undefined;
    this.reloadCampaigns();
  }

  onCampaignChange(campaignID: number|string) {
    this.rule.campaignID = campaignID;
    const campaign = this.campaignOptions.filter(c => c.id === this.rule.campaignID).pop();
    this.rule.metadata.campaignName = campaign.name;
    this.rule.orgID = campaign.org_id;
    this.rule.adgroupID = undefined;
    this.reloadAdgroups();
  }

  onAdgroupChange(adgroupID: number|string) {
    this.rule.adgroupID = adgroupID;
    const adgroup = this.adgroupOptions.filter(a => a.id === this.rule.adgroupID).pop();
    this.rule.metadata.adGroupName = adgroup.name;
  }

  addSimpleCondition(index) {
    this.simpleTasks[0].conditionGroup.conditions.splice(
      index + 1,
      0,
      JSON.parse(JSON.stringify(this.simpleTasks[0].conditionGroup.conditions[index]))
    );
  }

  removeSimpleCondition(index) {
    this.simpleTasks[0].conditionGroup.conditions.splice(index, 1);
  }

  save() {
    const descriptionPipe = new RuleDescriptionPipe();

    let campaignName, adGroupName;
    if (this.campaignOptions && this.campaignOptions.length) {
      campaignName = this.campaignOptions.filter(c => c.id === this.rule.campaignID).pop().name;
    }
    if (this.adgroupOptions && this.adgroupOptions.length) {
      adGroupName = this.adgroupOptions.filter(a => a.id === this.rule.adgroupID).pop().name;
    }

    this.rule.metadata = {
      accountName: this.credentials.filter(credential => credential.path === this.rule.account)[0].name,
      campaignName: campaignName || this.rule.metadata.campaignName,
      adGroupName: adGroupName || this.rule.metadata.adGroupName,
      actionDescription: descriptionPipe.transform(this.rule),
      description: '',
      title: this.rule.metadata.title
    };

    if (this.rule.adgroupID === -1) {
      delete this.rule.adgroupID;
    }
    this.editActionEmitter.emit(EditRuleAction.Save);

    if (!this.shouldContinueEditing) {
      this.editActionEmitter.emit(EditRuleAction.Close);
    }
  }

  close() {
    this.editActionEmitter.emit(EditRuleAction.Close);
  }

  cancel() {
    this.editActionEmitter.emit(EditRuleAction.Cancel);
  }
}
