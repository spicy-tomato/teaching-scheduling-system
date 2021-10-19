import { ControlValueAccessor, FormBuilder, FormGroup, ValidationErrors } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "./base.component";

export abstract class SubFormBase<T> extends BaseComponent implements ControlValueAccessor {
  //#region PUBLIC PROPERTIES
  public form!: FormGroup;
  //#endregion


  //#region PRIVATE PROPERTIES
  private onChange!: (value: T) => void;
  private onTouch!: () => void;
  //#endregion


  //#region GETTERS
  private get value(): T {
    return this.form.value as T;
  }
  //#endregion


  //#region SETTERS
  private set value(value: T) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouch();
  }
  //#endregion


  //#region CONSTRUCTOR
  constructor(protected readonly fb: FormBuilder) {
    super();
    this.initForm();
  }
  //#endregion


  //#endregion IMPLEMENTATIONS
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

  public setDisabledState(isDisable: boolean): void {
    isDisable
      ? this.form.disable()
      : this.form.enable();
  }
  //#endregion


  //#region PUBLIC METHODS
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
  //#endregion


  //#region PROTECTED METHODS
  protected initForm(): void {
    return;
  }
  //#endregion
}
