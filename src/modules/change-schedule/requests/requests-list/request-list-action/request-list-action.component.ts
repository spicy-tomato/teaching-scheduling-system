import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant } from '@shared/constants';
import { ChangeSchedule, Nullable } from '@shared/models';
import {
  TuiAppearance,
  TuiDialogService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from '../../state';
import { DenyDialogComponent } from '../../_shared/deny-dialog/deny-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ObservableHelper } from '@shared/helpers';

@Component({
  selector: 'tss-request-list-action',
  templateUrl: './request-list-action.component.html',
  styleUrls: ['./request-list-action.component.scss'],
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
export class RequestListActionComponent extends BaseComponent {
  /** INPUT */
  @Input() public displayText!: boolean;
  @Input() public item!: ChangeSchedule;

  /** PUBLIC PROPERTIES */
  public requesting$: Observable<number[]>;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    @Inject(Injector) private injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {
    super();

    this.requesting$ = store
      .select(fromRequests.selectRequestQueue)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  public onAccept(): void {
    this.store.dispatch(fromRequests.accept({ schedule: this.item }));
  }

  public onDeny(): void {
    this.dialogService
      .open<Nullable<string>>(
        new PolymorpheusComponent(DenyDialogComponent, this.injector),
        {
          label: 'Từ chối yêu cầu thay đổi lịch giảng',
          dismissible: false,
        }
      )
      .pipe(
        ObservableHelper.filterNullish(),
        tap((reason) =>
          this.store.dispatch(
            fromRequests.deny({ schedule: this.item, reason })
          )
        )
      )
      .subscribe();
  }
}
