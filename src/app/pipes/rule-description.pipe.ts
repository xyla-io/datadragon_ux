import { Pipe, PipeTransform } from '@angular/core';
import {Rule} from "../models/rule";
import {RuleTaskDescriptionPipe} from "./rule-task-description.pipe";

/*
 *
*/
@Pipe({name: 'ruleDescription'})
export class RuleDescriptionPipe implements PipeTransform {
  transform(rule: Rule): string {
    let components = rule.tasks.map(task => { return taskPipe.transform(task); });
    return components.join(' || ');
  }
}

let taskPipe = new RuleTaskDescriptionPipe();
