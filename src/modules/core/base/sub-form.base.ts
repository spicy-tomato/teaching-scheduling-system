import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Nullable } from 'src/shared/models';
import { BaseComponent } from './base.component';

export abstract class SubFormBase<T>
  extends BaseComponent
  implements ControlValueAccessor
{
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  /** PRIVATE PROPERTIES */
  private onChange!: (value: T) => void;
  private onTouch!: () => void;

  /** GETTERS */
  private get value(): T {
    return this.form.value as T;
  }

  /** SETTERS */
  private set value(value: T) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouch();
  }

  /** CONSTRUCTOR */
  constructor(protected readonly fb: FormBuilder) {
    super();
    this.initForm();
  }

  /** IMPLEMENTATIONS */
  public writeValue(value: T): void {
    if (value) {
      this.value = value;
    } else if (value == null) {
      this.form.reset();
    }
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisable: boolean): void {
    isDisable ? this.form.disable() : this.form.enable();
  }

  /** PUBLIC METHODS */
  public validate(): Nullable<ValidationErrors> {
    if (this.form.valid) {
      return null;
    }

    const errors: ValidationErrors = {};

    Object.keys(this.form.controls).forEach((k) => {
      if (this.form.controls[k].invalid) {
        errors[k] = this.form.controls[k].errors;
      }
    });

    return errors;
  }

  /** PROTECTED METHODS */
  protected initForm(): void {
    return;
  }
}
