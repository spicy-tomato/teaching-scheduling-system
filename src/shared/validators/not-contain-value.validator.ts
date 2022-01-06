import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function notContainValueValidator<T>(
  array: T[],
  field = ''
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return array.includes(control.value) ? null : { notContainValue: field };
  };
}
