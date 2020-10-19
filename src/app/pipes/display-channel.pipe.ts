import { Pipe, PipeTransform } from '@angular/core';
import { CredentialTarget, CredentialTargetDisplayName } from '../models/credential';

@Pipe({
  name: 'displayChannel'
})
export class DisplayChannelPipe implements PipeTransform {

  transform(value: CredentialTarget, args?: any): any {
    return CredentialTargetDisplayName[value] || '';
  }

}
