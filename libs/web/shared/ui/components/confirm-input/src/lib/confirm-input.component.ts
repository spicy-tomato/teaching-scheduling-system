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
  @Input() public field = '';
  @Input() public type = '';
  @Input() public disableConfirm = false;

  /** OUTPUT */
  @Output() public save = new EventEmitter();

  /** VIEWCHILD */
  @ViewChild(AbstractTuiControl)
  public inputComponent!: AbstractTuiControl<string>;

  /** PUBLIC PROPERTIES */
  public initialValue = '';
  public value = '';
  public processing = false;
  public showEdit = false;

  /** PRIVATE PROPERTIES */
  private onChange!: (value: string) => void;

  /** CONSTRUCTOR */
  constructor(private readonly cdr: ChangeDetectorRef) {}

  /** IMPLEMENTATIONS */
  public writeValue(value: string): void {
    this.initialValue = this.value = value;
    this.cdr.markForCheck();
  }

  public registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(): void {
    // Do nothing
  }

  /** PUBLIC METHODS */
  public onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  public onEdit(): void {
    this.showEdit = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.inputComponent as any).nativeFocusableElement?.focus();
  }

  public onCancel(): void {
    this.showEdit = false;
    this.value = this.initialValue;
  }

  public saveStart(): void {
    this.processing = true;
    this.save.emit(this.value);
  }

  public saveValue(): void {
    this.writeValue(this.value);
    this.onChange(this.value);
  }

  public finish() {
    this.showEdit = false;
    this.processing = false;
    this.cdr.markForCheck();
  }
}
