import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { InputDateRangeConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ComponentHelper } from '@teaching-scheduling-system/web/shared/utils/helpers';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'tss-input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputDateRangeComponent,
    },
  ],
})
export class InputDateRangeComponent implements ControlValueAccessor {
  /** PUBLIC PROPERTIES */
  public readonly items = InputDateRangeConstant.getPeriods();
  public readonly min = new TuiDay(2021, 10, 1);
  public control = new FormControl();

  /** PRIVATE PROPERTIES */
  private dialog$!: Observable<TuiDayRange>;
  private onChange!: (value: Nullable<TuiDayRange>) => void;

  /** CONSTRUCTOR */
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {
    this.initDialog();
  }

  /** IMPLEMENTATIONS */
  public writeValue(value: Nullable<TuiDayRange>): void {
    this.control.setValue(value);
  }

  public registerOnChange(fn: (value: Nullable<TuiDayRange>) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(): void {
    // Do nothing
  }

  /** PUBLIC METHODS */
  public onOpenTouchDialog(): void {
    this.dialog$
      .pipe(tap((value) => this.onValueChange(value, true)))
      .subscribe();
  }

  public onValueChange(
    value: Nullable<TuiDayRange>,
    needSetValue = false
  ): void {
    if (needSetValue) {
      this.control.setValue(value);
    }
    this.onChange(value);
  }

  /** PRIVATE METHODS */
  private initDialog(): void {
    const content = ComponentHelper.getMobileDialogContent(
      this.injector,
      this.control
    );

    this.dialog$ = this.dialogService.open(content, {
      size: 'fullscreen',
      closeable: false,
      data: {
        single: false,
        min: this.min,
      },
    });
  }
}
