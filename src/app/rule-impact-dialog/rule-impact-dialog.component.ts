import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Rule} from "../models/rule";
import {RuleImpactComponent} from "../rule-impact/rule-impact.component";

@Component({
  selector: 'app-rule-impact-dialog',
  templateUrl: './rule-impact-dialog.component.html',
  styleUrls: ['./rule-impact-dialog.component.css']
})
export class RuleImpactDialogComponent implements OnInit {
  public rule: Rule;
  @ViewChild(RuleImpactComponent) private ruleImpactComponent;

  constructor(
    public dialogRef: MatDialogRef<RuleImpactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rule = data.rule;
  }
  ngOnInit() {
  }

}
