/* Rule.ts */
import {RuleHistory} from './rule-history';

export interface RuleConditionGroup {
  conditions: RuleCondition[];
  subgroups: RuleConditionGroup[];
  operator: string;
}

export interface RuleCondition {
  metric: string;
  metricValue: number;
  operator: string;
}

export interface  RuleAction {
  action: string;
  adjustmentValue: number;
  adjustmentLimit: number;
}

export interface RuleTask {
  actions: RuleAction[];
  conditionGroup: RuleConditionGroup;
}

export interface Rule {
  _id?: string;

  created: Date;
  modified: Date;
  isEnabled: boolean;
  channel?: string;
  account?: string;
  orgID?: number|string;
  campaignID?: number|string;
  adgroupID?: number|string;

  history?: RuleHistory[];

  runInterval: number;
  granularity: string;
  dataCheckRange: number;

  lastTriggered?: Date;
  lastRun?: Date;

  shouldPerformAction: boolean;
  shouldSendEmail: boolean;
  shouldMonitor: boolean;
  safeMode: boolean;

  tasks: RuleTask[];
  metadata: RuleMetadata;
  options: Record<string, any>;
  // @ts-ignore
  numberOfDays?: number;
  // @ts-ignore
  adjustCredential?: any;
}

export interface RuleMetadata {
  accountName: string;
  campaignName: string;
  adGroupName: string;
  actionDescription: string;
  description: string;
  title?: string;
}

