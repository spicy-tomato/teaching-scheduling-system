import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractTuiControl } from '@taiga-ui/cdk';

@Component({
  selector: 'tss-confirm-input',
  templateUrl: './confirm-input.component.html',
  styleUrls: ['./confirm-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ConfirmInputComponent,
    },
  ],
})
export class ConfirmInputComponent implements ControlValueAccessor {
  /** INPUT */
  @Input() field = '';
  @Input() type = '';
  @Input() disableConfirm = false;

  /** OUTPUT */
  @Output() save = new EventEmitter();

  /** VIEWCHILD */
  @ViewChild(AbstractTuiControl)
  inputComponent!: AbstractTuiControl<string>;

  /** PUBLIC PROPERTIES */
  initialValue = '';
  value = '';
  processing = false;
  showEdit = false;

  /** PRIVATE PROPERTIES */
  private onChange!: (value: string) => void;

  /** CONSTRUCTOR */
  constructor(private readonly cdr: ChangeDetectorRef) {}

  /** IMPLEMENTATIONS */
  writeValue(value: string): void {
    this.initialValue = this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(): void {
    // Do nothing
  }

  /** PUBLIC METHODS */
  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  onEdit(): void {
    this.showEdit = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.inputComponent as any).nativeFocusableElement?.focus();
  }

  onCancel(): void {
    this.showEdit = false;
    this.value = this.initialValue;
  }

  saveStart(): void {
    this.processing = true;
    this.save.emit(this.value);
  }

  saveValue(): void {
    this.writeValue(this.value);
    this.onChange(this.value);
  }

  finish() {
    this.showEdit = false;
    this.processing = false;
    this.cdr.markForCheck();
  }
}
