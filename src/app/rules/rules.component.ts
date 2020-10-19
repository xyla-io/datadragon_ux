import {Component, OnInit, ViewChild} from '@angular/core';
import {RulesListComponent} from '../rules-list/rules-list.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {EditRuleDialogComponent} from '../edit-rule-dialog/edit-rule-dialog.component';
import {EditRuleAction} from '../edit-rule/edit-rule.component';
import {RuleService} from '../services/rule.service';
import {Rule} from '../models/rule';
import {RuleHistoryService} from '../services/rule-history.service';
import {RuleHistory} from '../models/rule-history';
import {RuleHistoryDialogComponent} from '../rule-history-dialog/rule-history-dialog.component';
import {ConfirmationDialogComponent, ConfirmationDialogType} from '../confirmation-dialog/confirmation-dialog.component';
import {RuleImpactDialogComponent} from '../rule-impact-dialog/rule-impact-dialog.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  @ViewChild(RulesListComponent)
  private rulesList: RulesListComponent;

  constructor(private ruleService: RuleService,
              private ruleHistoryService: RuleHistoryService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {}
  ngOnInit() {}

  async onAddRule(fromRule?: Rule|string) {
    let newRule;
    if (fromRule) {
      let resolvedRule = await this.ruleService.getByID(typeof fromRule === 'object' ? fromRule._id : fromRule)
      newRule = this._cloneRule(resolvedRule);
    } else {
      newRule = this._newRule();
    }

    this.openRule(newRule, 'New Rule', true, rule => {
      this._createRule(rule);
    });
  }

  onEditRule(rule: Rule|string) {
    this.ruleService.getByID(typeof rule === 'object' ? rule._id : rule)
      .then(rule => {
        this.openRule(rule, 'Edit Rule', false, rule => {
          this.ruleService.save(rule)
            .then(rule => {
              this.rulesList.refresh();
              this.snackBar.open('Rule Saved!', '', {
                duration: 2000,
              });
            })
            .catch(error => {
              this.rulesList.refresh();
            });
        });
      });
  }

  onDeleteRule(rule: Rule) {
    this._showConfirmationDialog(
      ConfirmationDialogType.Destructive,
      'Delete Rule',
      'This can\'t be undone.',
      'Cancel',
      'DELETE',
      () => {
        console.log('Cancel!');
      }, () => {
        console.log('Delete! ' + rule);
        this.ruleService.deleteByID(rule._id).then(() => {
          this.rulesList.refresh();
          this.snackBar.open('Rule Deleted', '', {
            duration: 2000,
          });
        });
      })
  }

  async onShowHistory(rule: Rule|string) {
    const retrievedRule = await (async () => {
      if (typeof rule === 'object') {
        return rule;
      }
      return await this.ruleService.getByID(rule);
    })();
    this.ruleHistoryService.getHistory(retrievedRule._id)
      .then(history => {
        retrievedRule.history = history;
        this._showHistoryDialog(history);
      });
  }

  onShowImpact(rule: Rule) {
    this._showImpactDialog(rule);
  }

  private _createRule(rule: Rule) {
    this.ruleService.create(rule)
      .then(rule => {
        this.rulesList.refresh();
        this.snackBar.open('Rule Saved!', '', {
          duration: 2000,
        });
      });
  }

  private openRule(rule: Rule, title: string, allowsSerialEditing: boolean, onSave: (rule: Rule) => void) {
    this._showRuleDialog(rule, title, allowsSerialEditing,rule => {
      if (this._ruleHasLimit(rule)) {
        onSave(rule);
      } else {
        this._showConfirmationDialog(ConfirmationDialogType.Default,
          'Rule has no limit',
          'Are you sure you want to continue?',
          'Cancel',
          'Continue',
          () => {
            this.openRule(rule, title, allowsSerialEditing, onSave);
          }, () => {
            onSave(rule);
          });
      }
    });
  }

  private _showHistoryDialog(history: RuleHistory[]) {
    console.log(history.length);
    const dialogRef = this.dialog.open(RuleHistoryDialogComponent, {
      height: this._historyDialogConfigHeight(history),
      data: {history: history}
    });
  }

  private _showImpactDialog(rule: Rule) {
    const dialogRef = this.dialog.open(RuleImpactDialogComponent, {
      data: {rule: rule}
    });
  }

  private _historyDialogConfigHeight(history: RuleHistory[]) {
    if (history.length === 0) {
      return '';
    } else {
      const paddingHeight = 48;
      const rowHeight = 49;
      const headerHeight = 49;
      const footerHeight = 56;

      const rows = Math.min(history.length, 8);
      const height = (rows * rowHeight) + headerHeight + footerHeight + paddingHeight;
      return `${height}px`;
    }
  }

  private _showConfirmationDialog(type: ConfirmationDialogType,
                                  title: string,
                                  subtitle: string,
                                  cancelButtonTitle: string,
                                  actionButtonTitle: string,
                                  onCancel: () => void,
                                  onAction: () => void) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogType: type,
        dialogTitle: title,
        dialogSubtitle: subtitle,
        cancelButtonTitle: cancelButtonTitle,
        actionButtonTitle: actionButtonTitle,
        onCancel: onCancel,
        onAction: onAction
      }
    });
  }

  private _showRuleDialog(rule: Rule, title: string, allowsSerialEditing: boolean, onSave: (rule: Rule) => void) {
    const dialogRef = this.dialog.open(EditRuleDialogComponent, {
      data: {
        rule: rule,
        dialogTitle: title,
        allowsSerialEditing: allowsSerialEditing,
        onSave: onSave,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log('Rule edit dismissed!');
        return;
      }

      switch (result.action) {
        case EditRuleAction.Cancel:
          console.log('Rule edit cancelled!');
          break;
        case EditRuleAction.Close:
          console.log('Rule edit closed!');
          break;
      }
    });
  }

  private _cloneRule(fromRule: Rule): Rule {
    const clonedRule: Rule = JSON.parse(JSON.stringify(fromRule));
    const removePropsRecursive = (keys: string[], obj: any) => {
      if (Array.isArray(obj)) {
        obj.forEach(item => {
          removePropsRecursive(keys, item);
        });
      } else if (obj && typeof obj === 'object') {
        keys.forEach(key => {
          if (obj[key]) { delete obj[key]; }
        });
        Object.keys(obj).forEach(propKey => {
          removePropsRecursive(keys, obj[propKey]);
        });
      }
    };
    removePropsRecursive(['_id', '__v'], clonedRule);
    delete clonedRule.lastRun;
    clonedRule.created = clonedRule.modified = new Date();
    if (clonedRule.metadata.title) {
      const prefix = 'COPY:';
      clonedRule.metadata.title = `${prefix} ${clonedRule.metadata.title}`;
    }
    return clonedRule;
  }

  private _newRule(): Rule {
    const creationDate = new Date();
    return {
      isEnabled: true,
      account: undefined,
      runInterval: 60 * 60 * 1000,
      dataCheckRange: 60 * 60 * 1000 * 24,
      granularity: 'HOURLY',
      shouldPerformAction: true,
      shouldSendEmail: false,
      shouldMonitor: false,
      safeMode: true,
      created: creationDate,
      modified: creationDate,
      tasks: [{
        actions: [{
          action: 'inc_bid',
          adjustmentValue: 20,
          adjustmentLimit: 3.5,
        }],
        conditionGroup: {
          subgroups: [],
          operator: 'all',
          conditions: [{
            metric: 'reavgCPA',
            metricValue: 3.5,
            operator: 'less',
          }]
        },
      }],
      metadata: {
        accountName: '',
        campaignName: '',
        adGroupName: '',
        actionDescription: '',
        description: '',
      },
      options: {},
    };
  }

  private _ruleHasLimit(rule: Rule): boolean {
    const limit = rule.tasks[0].actions[0].adjustmentLimit;
    return limit !== null;
  }
}
