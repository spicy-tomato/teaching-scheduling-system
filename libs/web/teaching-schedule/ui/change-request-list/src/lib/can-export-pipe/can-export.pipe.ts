import { Pipe, PipeTransform } from '@angular/core';
import { ChangeStatusHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Pipe({
  name: 'canExport',
})
export class CanExportPipe implements PipeTransform {
  transform(value: number): boolean {
    return ChangeStatusHelper.canExport(value);
  }
}
