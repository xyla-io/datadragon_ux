import { Pipe, PipeTransform } from '@angular/core';
import {RuleHistory} from "../models/rule-history";

/*
 *
*/
@Pipe({name: 'ruleHistoryDescription'})
export class RuleHistoryDescriptionPipe implements PipeTransform {
  transform(history: RuleHistory): string {
    var components: string[] = [];
    if (history.actionDescription !== '') {
      if (history.dryRun) {
        components.push(`<em>Dry Run:</em> would have ${history.actionDescription}`);        
      } else {
        components.push(history.actionDescription);        
      }
    }
    if (history.targetDescription !== null) {
      components.push(`<strong>${history.targetDescription}</strong>`);
    }
    return components.join(' for ');
  }
}
