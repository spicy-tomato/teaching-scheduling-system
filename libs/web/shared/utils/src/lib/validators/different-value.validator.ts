import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';

export function differentControlValueValidator<T>(
  otherControl: AbstractControl,
  options?: {
    comp?: (a: T, b: T) => boolean;
    error?: unknown;
  }
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errorValue = { differentValue: options?.error ?? true };
    const value = control.value as T;
    const otherValue = otherControl.value as T;

    if (
      ObjectHelper.isNullOrUndefined(value) &&
      ObjectHelper.isNullOrUndefined(otherValue)
    ) {
      return null;
    }

    if (
      (!options?.comp && value !== otherValue) ||
      options?.comp?.(value, otherValue) === false
    ) {
      return errorValue;
    }

    return null;
  };
}
