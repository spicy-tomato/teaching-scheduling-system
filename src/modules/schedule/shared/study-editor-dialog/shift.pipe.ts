import { Pipe, PipeTransform } from '@angular/core';
import { CoreConstant } from '@shared/constants';
import { BeautifyTimePipe } from '@pipes/beautify-date-time.pipe';

@Pipe({
  name: 'shift',
})
export class ShiftPipe implements PipeTransform {
  /** PRIVATE METHODS */
  private readonly beautifyTimePipe = new BeautifyTimePipe();

  /** PUBLIC METHODS */
  public transform(shiftKey: string): string {
    const shift = CoreConstant.SHIFTS[shiftKey];
    return `${this.beautify(shift.start[0])}:${this.beautify(
      shift.start[1]
    )} - ${this.beautify(shift.end[0])}:${this.beautify(shift.end[1])}`;
  }

  /** PRIVATE METHODS */
  private beautify(value: number): string {
    return this.beautifyTimePipe.transform(value);
  }
}
