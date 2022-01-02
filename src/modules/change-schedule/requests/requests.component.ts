import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoreConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import { ChangeSchedule } from '@shared/models';
import { TUI_BUTTON_OPTIONS, TuiAppearance } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import * as fromRequests from './state';

@Component({
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: 'square',
        appearance: TuiAppearance.Primary,
        size: 'xs',
      },
    },
  ],
})
export class RequestsComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public data$: Observable<ChangeSchedule[]>;
  public status$: Observable<EApiStatus>;
  public showTimeInsteadOfShift = false;
  public showTime = false;

  public readonly EApiStatus = EApiStatus;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly shifts = CoreConstant.SHIFTS;
  public readonly columns = [
    'index',
    'teacher',
    'oldDate',
    'newDate',
    'oldShift',
    'newShift',
    'oldRoom',
    'newRoom',
    'timeRequest',
    'timeAccept',
    'timeSetRoom',
    'status',
  ];

  /** CONSTRUCTOR */
  constructor(private readonly store: Store<fromRequests.RequestsState>) {
    this.data$ = store.select(fromRequests.selectChangeSchedules);
    this.status$ = store.select(fromRequests.selectStatus);
  }

  /** LIFE CYCLES */
  public ngOnInit(): void {
    this.store.dispatch(
      fromRequests.load({
        query: {
          status: 'all',
          page: 1,
        },
      })
    );
  }
}
