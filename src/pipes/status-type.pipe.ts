import { Pipe, PipeTransform } from '@angular/core';
import { ChangeStatusHelper } from '@shared/helpers';
import { Nullable, RequestChangeScheduleType } from '@shared/models';

@Pipe({
  name: 'statusType',
})
export class StatusTypePipe implements PipeTransform {
  public transform(value: number): Nullable<RequestChangeScheduleType> {
    return ChangeStatusHelper.getType(value);
  }
}
