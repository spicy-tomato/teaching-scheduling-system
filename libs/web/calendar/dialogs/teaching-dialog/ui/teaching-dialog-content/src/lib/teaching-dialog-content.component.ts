import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiNotification,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ChangeStatusHelper,
  DateHelper,
  FormHelper,
  ObservableHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { DialogService } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  teachingDialogCancel,
  TeachingDialogChange,
  teachingDialogReset,
  teachingDialogSelectCancelStatus,
  teachingDialogSelectChange,
  teachingDialogSelectChangeStatus,
  teachingDialogSelectJustRequestedSchedule,
  teachingDialogSelectRequestingChangeSchedule,
  teachingDialogSelectRequestStatus,
  teachingDialogSelectUpdateStatus,
  TeachingDialogState,
  teachingDialogToggleRequestChange,
  teachingDialogUpdate,
} from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  EjsScheduleModel,
  FixedScheduleModel,
  SimpleFixedScheduleModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectNameTitle,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { sameGroupStaticValueValidator } from '@teaching-scheduling-system/web/shared/utils/validators';
import {
  EMPTY,
  filter,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { TeachingDialogButtonsRightComponent } from './teaching-dialog-buttons-right/teaching-dialog-buttons-right.component';

@Component({
  selector: 'tss-teaching-dialog-content',
  templateUrl: './teaching-dialog-content.component.html',
  styleUrls: ['./teaching-dialog-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    FormHelper,
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 'm',
      },
    },
  ],
})
export class TeachingDialogContentComponent implements OnInit {
  /** INPUT */
  @Input() public schedule!: EjsScheduleModel;

  /** OUTPUT */
  @Output() public updateSchedule = new EventEmitter<FixedScheduleModel>();
  @Output() public changeScheduleInfo =
    new EventEmitter<TeachingDialogChange>();
  @Output() public cancelRequest = new EventEmitter();
  @Output() public cancel = new EventEmitter();

  /** VIEWCHILD */
  @ViewChild(TeachingDialogButtonsRightComponent)
  public rightButtonComponent!: TeachingDialogButtonsRightComponent;

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public isPersonal!: boolean;
  public validRequestChangeSchedule!: boolean;
  public firstDateAllowRequestChange!: Date;
  public requestedChangeSchedule: Nullable<FixedScheduleModel> = null;
  public requestChangeToUndeterminedDay = false;
  public changed = false;

  public readonly changeStatus$: Observable<EApiStatus>;
  public readonly requestStatus$: Observable<EApiStatus>;
  public readonly updateStatus$: Observable<EApiStatus>;
  public readonly cancelStatus$: Observable<EApiStatus>;
  public readonly requestingChangeSchedule$: Observable<boolean>;
  public readonly justRequestedSchedule$: Observable<
    Nullable<SimpleFixedScheduleModel>
  >;

  public readonly cancelRequest$ = new Subject<void>();

  public readonly EApiStatus = EApiStatus;
  public readonly CoreConstant = CoreConstant;

  /** PRIVATE PROPERTIES */
  private readonly change$: Observable<TeachingDialogChange>;
  private readonly nameTitle$: Observable<string>;

  /** GETTERS */
  public get requestControl(): FormGroup {
    return this.form.controls['request'] as FormGroup;
  }

  private get roomControlValue(): string {
    return this.requestControl.controls['room'].value as string;
  }

  private get shiftControlValue(): string {
    return this.requestControl.controls['shift'].value as string;
  }

  private get dateControlValue(): TuiDay {
    return this.requestControl.controls['date'].value as TuiDay;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store<TeachingDialogState>,
    private readonly formHelper: FormHelper,
    private readonly dialogService: DialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.changeStatus$ = store
      .select(teachingDialogSelectChangeStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestStatus$ = store
      .select(teachingDialogSelectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.updateStatus$ = store
      .select(teachingDialogSelectUpdateStatus)
      .pipe(takeUntil(this.destroy$));
    this.cancelStatus$ = store
      .select(teachingDialogSelectCancelStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestingChangeSchedule$ = store
      .select(teachingDialogSelectRequestingChangeSchedule)
      .pipe(takeUntil(this.destroy$));
    this.justRequestedSchedule$ = store
      .select(teachingDialogSelectJustRequestedSchedule)
      .pipe(takeUntil(this.destroy$));
    this.change$ = store
      .select(teachingDialogSelectChange)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(selectNameTitle)
      .pipe(takeUntil(this.destroy$));
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.initForm();

    this.handleStatusChange();
    this.handleJustRequestedScheduleChange();
    this.handleChange();
    this.handleCancelRequest();

    this.requestedChangeSchedule =
      this.schedule.FixedSchedules?.find((x) =>
        ChangeStatusHelper.isPending(x.status)
      ) || null;

    (this.form.controls['change'] as FormGroup).controls['note'].valueChanges
      .pipe(
        withLatestFrom(this.requestingChangeSchedule$),
        filter(({ 1: requestingChangeSchedule }) => !requestingChangeSchedule),
        tap(() => this.rightButtonComponent.markForCheck()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /** PUBLIC METHODS */
  public toggleRequestArea(open: boolean): void {
    this.store.dispatch(teachingDialogToggleRequestChange({ open }));
  }

  public onUpdate(): void {
    const id = this.schedule.Id;
    const body = {
      note: (this.form.controls['change'] as FormGroup).controls['note']
        .value as string,
    };

    this.store.dispatch(teachingDialogUpdate({ id, body }));
  }

  public showNotificationError(): void {
    this.notificationsService
      .show('Vui lòng thử lại sau', {
        label: 'Đã có lỗi xảy ra',
        status: TuiNotification.Error,
      })
      .subscribe();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    const data = this.schedule;

    const startDate = data.StartTime as Date;
    const endDate = data.EndTime as Date;
    const today = new Date();
    const startTuiDate = startDate
      ? DateHelper.toTuiDay(startDate)
      : DateHelper.toTuiDay(today);
    const endTuiDate = endDate
      ? DateHelper.toTuiDay(endDate)
      : DateHelper.toTuiDay(today);
    const room = data.Location;

    const todayToZero = DateHelper.dateAtZero(today);
    this.firstDateAllowRequestChange = DateHelper.subtract(todayToZero, 14);
    this.isPersonal = data.People?.[0] === 'self';
    this.validRequestChangeSchedule =
      startDate >= new Date(2022, 2, 1) || !this.isPersonal;

    const initialRequest = this.isPersonal
      ? {
          date: startTuiDate,
          shift: data.Shift ?? '1',
          online: room === 'PHTT',
        }
      : {
          date: startTuiDate,
          shift: data.Shift ?? '1',
          room: room,
        };

    const initialChange = {
      note: data.Note ?? '',
    };

    this.form = this.fb.group({
      id: [data.Id],
      subject: [data.Subject],
      location: [room],
      people: [
        typeof data.People?.[0] === 'string'
          ? data.People?.[0]
          : (data.People?.[0] as SimpleModel).name,
      ],
      start: [[startTuiDate, DateHelper.beautifyTime(startDate ?? today)]],
      end: [[endTuiDate, DateHelper.beautifyTime(endDate ?? today)]],
      request: this.fb.group(
        {
          shift: [initialRequest.shift],
          date: [initialRequest.date, Validators.required],
          online: [initialRequest.online],
          room: [room, this.isPersonal ? [] : [Validators.required]],
          reason: [
            '',
            this.isPersonal
              ? [
                  Validators.required,
                  Validators.maxLength(
                    this.CoreConstant.REASON_CHANGE_SCHEDULE_MAX_LENGTH
                  ),
                ]
              : [],
          ],
        },
        {
          validators: sameGroupStaticValueValidator(initialRequest, {
            date: (a: Nullable<TuiDay>, b: Nullable<TuiDay>) =>
              !!a && !!b && a.daySame(b),
          }),
        }
      ),
      requestIntend: this.fb.group({
        intendTime: [
          '',
          [
            Validators.required,
            Validators.maxLength(
              CoreConstant.INTEND_TIME_CHANGE_SCHEDULE_MAX_LENGTH
            ),
          ],
        ],
        reason: [
          '',
          [
            Validators.required,
            Validators.maxLength(
              this.CoreConstant.REASON_CHANGE_SCHEDULE_MAX_LENGTH
            ),
          ],
        ],
      }),
      change: this.getNewChangeControl(initialChange),
    });

    this.store.dispatch(teachingDialogReset({ change: initialChange }));
  }

  private handleStatusChange(): void {
    this.updateStatus$
      .pipe(
        tap((status) => {
          switch (status) {
            case EApiStatus.successful:
              this.changed = true;
              this.showNotificationUpdateSuccessful();
              break;
            case EApiStatus.systemError:
              this.showNotificationError();
              break;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.requestStatus$
      .pipe(
        tap((status) => {
          switch (status) {
            case EApiStatus.successful:
              this.showNotificationRequestChangeSuccessful();
              break;
            case EApiStatus.systemError:
              this.showNotificationError();
              break;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.changeStatus$
      .pipe(
        tap((status) => {
          switch (status) {
            case EApiStatus.successful: {
              this.changed = true;
              const [start, end] = DateHelper.fromShift(
                this.dateControlValue.toUtcNativeDate(),
                this.shiftControlValue
              );
              this.form.patchValue({
                location: this.roomControlValue,
                start: [
                  DateHelper.toTuiDay(start),
                  DateHelper.beautifyTime(start),
                ],
                end: [DateHelper.toTuiDay(end), DateHelper.beautifyTime(end)],
              });
              this.showNotificationUpdateSuccessful();
              break;
            }
            case EApiStatus.systemError:
              this.showNotificationError();
              break;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.cancelStatus$
      .pipe(
        filter((status) => status === EApiStatus.successful),
        tap(() => {
          this.requestedChangeSchedule = null;
          this.cancelRequest.emit();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleJustRequestedScheduleChange(): void {
    this.justRequestedSchedule$
      .pipe(
        mergeMap((request) =>
          iif(
            () => request !== null,
            of(request).pipe(
              ObservableHelper.filterNullish(),
              tap((request) => {
                const controls = this.form.controls;
                this.updateSchedule.emit({
                  ...request,
                  idSchedule: this.schedule.Id,
                  oldDate: (
                    controls['start'].value as [TuiDay, TuiTime]
                  )[0].getFormattedDay('YMD', '-'),
                  oldIdRoom: controls['location'].value as string,
                  oldShift: this.schedule.Shift ?? '1',
                  isNew: true,
                });
              })
            ),
            EMPTY
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleCancelRequest(): void {
    this.cancelRequest$
      .pipe(
        withLatestFrom(this.nameTitle$),
        map(({ 1: title }) => title),
        tap((title) => {
          this.dialogService
            .showConfirmDialog({
              header: `${title} có chắc chắn muốn hủy yêu cầu này không?`,
              positive: 'Có',
              negative: 'Không',
            })
            .pipe(
              filter((x) => x),
              map(
                () =>
                  this.schedule.FixedSchedules?.find((x) =>
                    ChangeStatusHelper.isPending(x.status)
                  )?.id
              ),
              ObservableHelper.filterNullish(),
              tap((id) => {
                this.store.dispatch(teachingDialogCancel({ id }));
              })
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleChange(): void {
    this.change$
      .pipe(
        tap((change) => {
          this.form.controls['change'] = this.getNewChangeControl(change);
          this.changeScheduleInfo.emit(change);
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showNotificationRequestChangeSuccessful(): void {
    this.notificationsService
      .show('Vui lòng chờ phản hồi của trưởng bộ môn', {
        label: 'Gửi yêu cầu thành công',
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private showNotificationUpdateSuccessful(): void {
    this.notificationsService
      .show('Cập nhật lịch thành công!', {
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private getNewChangeControl(value: TeachingDialogChange): FormGroup {
    return this.formHelper.createNewFormGroup(
      {
        note: [value.note],
      },
      sameGroupStaticValueValidator(value, {
        date: (a: Nullable<TuiDay>, b: Nullable<TuiDay>) =>
          !!a && !!b && a.daySame(b),
      })
    );
  }
}
