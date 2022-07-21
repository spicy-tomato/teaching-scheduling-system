import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';

export function sameGroupStaticValueValidator(
  obj: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comp?: Record<string, (a: any, b: any) => boolean>
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let same = true;

    for (const key of Object.keys(obj)) {
      const controlValue = control.get(key)?.value;
      const value = obj[key];
      if (
        ObjectHelper.isNullOrUndefined(value) &&
        ObjectHelper.isNullOrUndefined(controlValue)
      ) {
        continue;
      }

      if (
        (controlValue !== value && !comp?.[key]) ||
        comp?.[key]?.(controlValue, value) === false
      ) {
        same = false;
        break;
      }
    }

    return same ? { sameValue: true } : null;
  };
}

export function sameControlValueValidator<T>(
  otherControl: AbstractControl,
  options?: {
    comp?: (a: T, b: T) => boolean;
    error?: unknown;
  }
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errorValue = { sameValue: options?.error ?? true };
    const value = control.value as T;
    const otherValue = otherControl.value as T;

    if (
      ObjectHelper.isNullOrUndefined(value) &&
      ObjectHelper.isNullOrUndefined(otherValue)
    ) {
      return errorValue;
    }

    if (
      (!options?.comp && value !== otherValue) ||
      options?.comp?.(value, otherValue) === false
    ) {
      return null;
    }

    return errorValue;
  };
}
