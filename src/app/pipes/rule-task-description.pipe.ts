import { Pipe, PipeTransform } from '@angular/core';
import {RuleCondition, RuleConditionGroup, RuleTask} from "../models/rule";

/*
 *
*/
@Pipe({name: 'ruleTaskDescription'})
export class RuleTaskDescriptionPipe implements PipeTransform {
  transform(task: RuleTask): string {
    let components: string[] = [
      conditionGroupDescription(task.conditionGroup),
      '→',
      `${action(task.actions[0].action)}`,
    ];

    if (!['no_action', 'pause_keyword', 'pause_campaign'].includes(task.actions[0].action)) {
      components = components.concat([
        `${task.actions[0].adjustmentValue}%`,
        '⇥',
        `$${task.actions[0].adjustmentLimit}`,
      ]);
    }
    return components.join(' ');
  }
}

function conditionGroupDescription(group: RuleConditionGroup): string {
  let conditionDescriptions = group.conditions.map(conditionDescription);
  let subgroupDescriptions = group.subgroups.map(conditionGroupDescription);

  let components = conditionDescriptions.concat(subgroupDescriptions);

  if (components.length === 1) { return components[0] }

  let operator = groupOperator(group.operator);

  return `( ${components.join(' ' + operator + ' ')} )`
}

function conditionDescription(condition: RuleCondition): string {
  let components: string[] = [
    metric(condition.metric),
    `${conditionalOperator(condition.operator)}`,
    `$${condition.metricValue}`,
  ];

  return components.join(' ');
}

function conditionalOperator(operator: string): string {
  switch (operator) {
    case 'greater': return '>';
    case 'less': return '<';
    case 'geq': return '≥';
    case 'leq': return '≤';
    case 'equal': return '=';
    default: return operator;
  }
}

function groupOperator(operator: string): string {
  switch (operator) {
    case 'all': return '&';
    case 'any': return '|';
    default: return operator;
  }
}

function action(action: string): string {
  switch (action) {
    case 'inc_bid': return '☝︎ Bid';
    case 'dec_bid': return '☟ Bid';
    // TODO: Create pause actions for other entities and add 'keyword' back to this action's description
    case 'pause_keyword': return '⏸ Keyword';
    case 'pause_campaign': return '⏸ Campaign';
    case 'no_action': return '∅';
    case 'inc_cpa_goal': return '☝︎ CPA Goal';
    case 'dec_cpa_goal': return '☟ CPA Goal';
    case 'inc_cpa_goal_campaign': return '☝︎ Campaign 🎯 CPA';
    case 'dec_cpa_goal_campaign': return '☟ Campaign 🎯 CPA';
    case 'increase_campaign_budget': return '☝︎ Campaign 💰';
    case 'decrease_campaign_budget': return '☟ Campaign 💰';
    case null: return '∅';
  }
}

function metric(kpiMetric: string): string {
  switch (kpiMetric) {
    case 'reavgCPA': return 'CPA';
    case 'reavgCPT': return 'CPT';
    case 'reavgCPM': return 'CPM';
    case 'totalSpend': return 'Spend';
    case 'totalImpressions': return 'Impressions';
    case 'totalTaps': return 'Taps';
    case 'totalConversions': return 'Conversions';
    case 'reavgTTR': return 'TTR';
    case 'reavgConversionRate': return 'CR';
  }
}
