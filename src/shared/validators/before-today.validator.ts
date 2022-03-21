import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';

export function beforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const beforeToday = (control.value as TuiDay).dayBefore(
      TuiDay.currentLocal()
    );
    return beforeToday ? { beforeToday: true } : null;
  };
}
