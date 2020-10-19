import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {RuleHistoryComponent} from "../rule-history/rule-history.component";
import {RuleHistory} from "../models/rule-history";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-rule-history-dialog',
  templateUrl: './rule-history-dialog.component.html',
  styleUrls: ['./rule-history-dialog.component.css']
})
export class RuleHistoryDialogComponent implements OnInit {
  public history: RuleHistory[];
  @ViewChild(RuleHistoryComponent) private ruleHistoryComponent;

  constructor(
    public dialogRef: MatDialogRef<RuleHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.history = data.history;
  }

  ngOnInit() {
  }
}
