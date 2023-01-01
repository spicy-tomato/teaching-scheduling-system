import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';

export function sameGroupStaticValueValidator<
  T extends Record<string, unknown>
>(
  obj: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comp?: {
    [Properties in keyof T]?: (
      a: Nullable<T[Properties]>,
      b: Nullable<T[Properties]>,
      control?: AbstractControl
    ) => boolean;
  }
  // Record<keyof U, (a: T, b: T) => boolean>
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
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
        comp?.[key]?.(controlValue, value as Nullable<T[string]>, control) ===
          false
      ) {
        return null;
      }
    }

    return { sameValue: true };
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
