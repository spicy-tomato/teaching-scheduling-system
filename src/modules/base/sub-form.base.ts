import { ControlValueAccessor, FormBuilder, FormGroup, ValidationErrors } from "@angular/forms";
import { takeUntil, tap } from "rxjs/operators";
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
  protected abstract validate(): ValidationErrors | null;

  constructor(protected fb: FormBuilder) {
    super();
    this.initForm();
    this.handleFormChange();
  }

  public writeValue(value: T): void {
    if (value) {
      this.value = value;
    } else if (value == null) {
      this.form.reset();
    }
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  private handleFormChange(): void {
    this.form.valueChanges
      .pipe(
        tap((value) => {
          if (this.onChange){
            this.onChange(value);
          }

          if (this.onTouch){
            this.onTouch();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
