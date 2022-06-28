import { Pipe, PipeTransform } from '@angular/core';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Pipe({
  name: 'shift',
})
export class ShiftPipe implements PipeTransform {
  /** PUBLIC METHODS */
  public transform(shiftKey: Nullable<string>): string {
    if (!shiftKey) return '';

    const shift = CoreConstant.SHIFTS[shiftKey];
    return `Ca ${shiftKey} (${this.beautify(shift.start[0])}:${this.beautify(
      shift.start[1]
    )} - ${this.beautify(shift.end[0])}:${this.beautify(shift.end[1])})`;
  }

  /** PRIVATE METHODS */
  private beautify(value: number): string {
    return DateHelper.beautifyDay(value);
  }
}
