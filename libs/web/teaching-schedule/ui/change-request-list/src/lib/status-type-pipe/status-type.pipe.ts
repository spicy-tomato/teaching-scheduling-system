import { Pipe, PipeTransform } from '@angular/core';
import {
  Nullable,
  RequestChangeScheduleType,
} from '@teaching-scheduling-system/core/data-access/models';
import { ChangeStatusHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Pipe({
  name: 'statusType',
})
export class StatusTypePipe implements PipeTransform {
  transform(value: number): Nullable<RequestChangeScheduleType> {
    return ChangeStatusHelper.getType(value);
  }
}
