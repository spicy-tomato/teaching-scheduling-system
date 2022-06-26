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
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiInputComponent } from '@taiga-ui/kit';

@Component({
  selector: 'tss-confirm-input',
  templateUrl: './confirm-input.component.html',
  styleUrls: ['./confirm-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
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
  
  /** OUTPUT */
  @Output() public save = new EventEmitter();
  
  /** VIEWCHILD */
  @ViewChild(TuiInputComponent) public inputComponent!: TuiInputComponent;
  
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
  }

  public onEdit(): void {
    this.showEdit = true;
    this.inputComponent.nativeFocusableElement?.focus();
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
