import { Pipe, PipeTransform } from '@angular/core';
import {
  Nullable,
  RequestChangeScheduleType,
} from '@teaching-scheduling-system/core/data-access/models';
import { ChangeStatusHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Pipe({
  name: 'changeStatusType',
})
export class ChangeStatusTypePipe implements PipeTransform {
  public transform(value: number): Nullable<RequestChangeScheduleType> {
    return ChangeStatusHelper.getType(value);
  }
}
