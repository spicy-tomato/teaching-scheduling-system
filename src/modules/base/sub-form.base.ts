import { ControlValueAccessor, FormBuilder, FormGroup, ValidationErrors } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "./base.component";

export abstract class SubFormBase<T> extends BaseComponent implements ControlValueAccessor {
  public form!: FormGroup;

  private onChange!: (value: T) => void;
  private onTouch!: () => void;

  private get value(): T {
    return this.form.value as T;
  }

  private set value(value: T) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouch();
  }

  protected abstract initForm(): void;

  constructor(protected readonly fb: FormBuilder) {
    super();
    this.initForm();
  }

  public writeValue(value: T): void {
    if (value) {
      this.value = value;
    } else if (value == null) {
      this.form.reset();
    }
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public validate(): ValidationErrors | null {
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

  public setDisabledState(isDisable: boolean): void {
    isDisable
      ? this.form.disable()
      : this.form.enable();
  }
}
