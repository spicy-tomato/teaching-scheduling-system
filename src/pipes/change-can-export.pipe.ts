import { Pipe, PipeTransform } from '@angular/core';
import { ChangeStatusHelper } from '@shared/helpers';

@Pipe({
  name: 'changeCanExport',
})
export class ChangeCanExportPipe implements PipeTransform {
  public transform(value: number): boolean {
    return ChangeStatusHelper.canExport(value);
  }
}
