import {Component, OnInit, OnChanges, Input, ViewChild} from '@angular/core';
import {RuleHistory, RuleHistoryType} from "../models/rule-history";
import {Observable} from "rxjs/Observable";
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator} from "@angular/material";
import 'rxjs/add/observable/merge';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-rule-history',
  templateUrl: './rule-history.component.html',
  styleUrls: ['./rule-history.component.css']
})
export class RuleHistoryComponent extends DataSource<RuleHistory> implements OnInit, OnChanges {
  @Input() history: RuleHistory[];
  public historyData: BehaviorSubject<RuleHistory[]> = new BehaviorSubject<RuleHistory[]>([]);
  public displayedColumns = ['historyCreationDate', 'lastDataCheckedDate', 'description'];
  public RuleHistoryType = RuleHistoryType;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {
    super()
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.historyData.next(this.history || []);
  }

  connect(): Observable<RuleHistory[]> {
    const displayDataChanges = [
      this.historyData,
      this.paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.historyData.value.filter(history => RuleHistoryType[history.historyType] !== RuleHistoryType.execute);

      // Grab the page's slice of data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  historyDetail(history: RuleHistory): string {
    switch (RuleHistoryType[history.historyType]) {
      case RuleHistoryType.edited: return 'PREVIOUS RULE: ' + history.ruleDescription;
      case RuleHistoryType.failed:
      case RuleHistoryType.error: return history.errorDescriptions.map((error, index) => 'ERROR ' + (index + 1) + ': ' + error).join(' ');
      default: return history.ruleDescription;
    }
  }

  disconnect() {}
}
