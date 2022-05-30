import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

@Injectable()
export class FormHelper {
  constructor(private readonly fb: FormBuilder) {}

  public createNewFormGroup(
    value: { [key: string]: unknown },
    validators: ValidatorFn
  ): FormGroup {
    return this.fb.group(value, { validators });
  }

  public getNewFormControl<T>(value: T, validators: ValidatorFn): FormControl {
    return this.fb.control(value, validators);
  }
}
