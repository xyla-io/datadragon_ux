import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

import {Rule} from '../models/rule';
import {EditRuleAction, EditRuleComponent} from "../edit-rule/edit-rule.component";

@Component({
  selector: 'app-edit-rule-dialog',
  templateUrl: './edit-rule-dialog.component.html',
  styleUrls: ['./edit-rule-dialog.component.css']
})
export class EditRuleDialogComponent implements OnInit {

  private dialogTitle = "";
  public editedRule: Rule;
  public allowsSerialEditing = false;
  private onSave: (rule: Rule) => void;
  @ViewChild(EditRuleComponent) private editRuleComponent;

  constructor(
    public dialogRef: MatDialogRef<EditRuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editedRule = data.rule;
    this.dialogTitle = data.dialogTitle;
    this.allowsSerialEditing = data.allowsSerialEditing;
    this.onSave = data.onSave;
  }

  onRuleAction(action: EditRuleAction) {
    switch(action) {
      case EditRuleAction.Save:
        this.onSave(this.editRuleComponent.rule);
        break;
      case EditRuleAction.Close:
      case EditRuleAction.Cancel:
        this.dialogRef.close({ action: action });
        break;
    }
  }

  ngOnInit() {
  }
}
