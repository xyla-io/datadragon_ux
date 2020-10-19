import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MatSort} from '@angular/material';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import {RuleService, UpdateRule} from '../services/rule.service';
import {Rule} from '../models/rule';
import {RuleHistoryDialogComponent} from '../rule-history-dialog/rule-history-dialog.component';
import {Subscription} from 'rxjs/Subscription';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import { CredentialTargetDisplayName } from '../models/credential';
import { CampaignService } from '../services/campaign.service';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})

export class RulesListComponent extends DataSource<Rule> implements OnInit, OnDestroy, AfterViewInit {
  CredentialTargetDisplayName = CredentialTargetDisplayName;
  private rulesLoader: Subject<never> = new Subject();
  private rulesDataChange: BehaviorSubject<Rule[]> = new BehaviorSubject<Rule[]>([]);
  public displayedColumns = [
    'channel',
    'account',
    'campaign',
    'adgroup',
    'intervalCheckColumn',
    'title',
    'impact',
    'history',
    'edit',
    'clone',
    'delete',
    'active'
  ];
  private keyUpSubscription: Subscription;

  public dialogRef: MatDialogRef<RuleHistoryDialogComponent>;

  @Output() addRuleEmitter = new EventEmitter();
  @Output() deleteRuleEmitter = new EventEmitter<Rule>();
  @Output() editRuleEmitter = new EventEmitter<Rule>();
  @Output() showHistoryEmitter = new EventEmitter<Rule>();
  @Output() showImpactEmitter = new EventEmitter<Rule>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  _filterChange = new BehaviorSubject('');
  destroyed$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private ruleService: RuleService,
    private campaignService: CampaignService,
  ) {
    super();
  }

  ngOnInit() {
    this.rulesLoader.switchMap(() => this.ruleService.getRules()).subscribe(rules => {
      this.preloadCampaigns(rules);
      this.rulesDataChange.next(rules);
    });

    this.keyUpSubscription = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this._filterChange.next(this.filter.nativeElement.value);
      });
  }

  ngOnDestroy() {
    this.keyUpSubscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.rulesLoader.next();
  }

  deleteRule(rule: Rule) {
    this.deleteRuleEmitter.emit(rule);
  }

  addRule() {
    this.addRuleEmitter.emit();
  }

  editRule(rule: Rule) {
    this.editRuleEmitter.emit(rule);
  }

  cloneRule(rule: Rule) {
    this.addRuleEmitter.emit(rule);
  }

  showImpact(rule: Rule) {
    this.showImpactEmitter.emit(rule);
  }

  showHistory(rule: Rule) {
    console.log('Show history for rule!');
    this.showHistoryEmitter.emit(rule);
  }

  update(update: UpdateRule, lastModified: Date) {
    update.modified = lastModified;
    this.ruleService.update(update).then((rule) => {
      console.log('Toggle enabled successful: ', rule);
      this.refresh();
    }).catch(error => {
      console.log(error);
      this.refresh();
    });
  }

  accordionOpened(rule: Rule) {
    console.log('Load history for rule with id: ', rule._id);
  }

  accordionClosed(rule: Rule) {
    console.log('Closing rule: ', rule);
  }

  // DataSource<Rule> overrides
  connect(): Observable<Rule[]> {
    const displayDataChanges = [
      this.rulesDataChange,
      this._filterChange,
      this.sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.rulesDataChange.value.slice();
      data = this.filterData(data);
      data = this.sortData(data);

      return data;
    });
  }

  disconnect() {}

  filterData(data: Rule[]): Rule[] {
    return data.filter((rule: Rule) => {
      const meta = rule.metadata;
      const searchStr = (meta.description + rule.adgroupID + rule.campaignID).toLowerCase();
      return searchStr.indexOf(this._filterChange.value.toLowerCase()) !== -1;
    });
  }

  sortData(data: Rule[]): Rule[] {
    if (!this.sort.active || this.sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string|boolean|(number|string|boolean)[] = '';
      let propertyB: number|string|boolean|(number|string|boolean)[] = '';

      switch (this.sort.active) {
        case 'account': [propertyA, propertyB] = [a.account, b.account]; break;
        case 'campaign': [propertyA, propertyB] = [a.metadata.campaignName, b.metadata.campaignName]; break;
        case 'adgroup': [propertyA, propertyB] = [a.metadata.adGroupName, b.metadata.adGroupName]; break;
        case 'actionDescription': [propertyA, propertyB] = [a.metadata.actionDescription, b.metadata.actionDescription]; break;
        case 'email': [propertyA, propertyB] = [a.shouldSendEmail, b.shouldSendEmail]; break;
        case 'action': [propertyA, propertyB] = [a.shouldPerformAction, b.shouldPerformAction]; break;
        case 'active': [propertyA, propertyB] = [a.isEnabled, b.isEnabled]; break;
        case 'intervalCheckColumn': [
          propertyA,
          propertyB
        ] = [
          [a.runInterval, a.dataCheckRange],
          [b.runInterval, b.dataCheckRange]
        ];
        console.log(a.isEnabled, b.isEnabled); break;
      }

      if (Array.isArray(propertyA) && Array.isArray(propertyB)) {
        const arrayA = propertyA;
        const arrayB = propertyB;
        for (let i = 0; i < arrayA.length; i++) {
          propertyA = arrayA[i];
          propertyB = arrayB[i];
          if (arrayA[i] !== arrayB[i]) { break; }
        }
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }

  preloadCampaigns(rules: Rule[]) {
    const accountSet = rules.reduce((set, rule) => {
      if (rule.account) {
        set.add(rule.account);
      }
      return set;
    }, new Set<string>());

    (Array.from(accountSet) as string[]).forEach(account => {
      console.log('preloading:', account);
      this.campaignService.getCampaigns(account)
        .pipe(take(1))
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          console.log('preloaded', account);
        });
    });
  }

}
