import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TuiMonth } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiHostedDropdownComponent,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import {
  tuiIconChevronDown,
  tuiIconChevronLeftLarge,
  tuiIconChevronRightLarge,
} from '@taiga-ui/icons';

@Component({
  selector: 'tss-schedule-header',
  templateUrl: './schedule-header.component.html',
  styleUrls: ['./schedule-header.component.scss'],
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: 'square',
        appearance: TuiAppearance.Flat,
        size: 'xs',
      },
    },
  ],
})
export class ScheduleHeaderComponent {
  /** INPUT */
  @Input() public dateRange!: string;
  @Input() public view!: 'Month' | 'Week' | 'Day';
  @Input() public month!: TuiMonth;

  /** OUTPUT */
  @Output() public prev = new EventEmitter<void>();
  @Output() public next = new EventEmitter<void>();
  @Output() public chooseMonth = new EventEmitter<TuiMonth>();
  @Output() public clickToday = new EventEmitter<void>();
  @Output() public clickMonth = new EventEmitter<void>();
  @Output() public clickWeek = new EventEmitter<void>();
  @Output() public clickDay = new EventEmitter<void>();

  /** VIEWCHILD */
  @ViewChild(TuiHostedDropdownComponent)
  public hostedDropdown?: TuiHostedDropdownComponent;

  /** PUBLIC PROPERTIES */
  public openDropdown = false;
  public readonly prevIcon = tuiIconChevronLeftLarge;
  public readonly nextIcon = tuiIconChevronRightLarge;
  public readonly dropdownIcon = tuiIconChevronDown;

  public onMonthClick(month: TuiMonth): void {
    this.openDropdown = false;
    this.chooseMonth.next(month);
  }
}
