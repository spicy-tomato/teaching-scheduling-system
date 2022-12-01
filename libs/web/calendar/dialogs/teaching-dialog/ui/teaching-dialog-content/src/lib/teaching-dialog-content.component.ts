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
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  tuiButtonOptionsProvider,
  TuiNotification,
} from '@taiga-ui/core';
import {
  CoreConstant,
  IconConstant,
} from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ChangeStatusHelper,
  DateHelper,
  ObservableHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { DialogService } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  TeachingDialogChange,
  TeachingDialogStore,
} from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  EjsScheduleModel,
  FixedScheduleModel,
  SimpleFixedScheduleModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { sameGroupStaticValueValidator } from '@teaching-scheduling-system/web/shared/utils/validators';
import {
  filter,
  map,
  Observable,
  of,
  skip,
  Subject,
  switchMap,
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
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
  ],
})
export class TeachingDialogContentComponent implements OnInit {
  // INPUT
  @Input() schedule!: EjsScheduleModel;

  // OUTPUT
  @Output() updateSchedule = new EventEmitter<FixedScheduleModel>();
  @Output() changeScheduleInfo = new EventEmitter<TeachingDialogChange>();
  @Output() cancelRequest = new EventEmitter();
  @Output() cancel = new EventEmitter();

  // VIEWCHILD
  @ViewChild(TeachingDialogButtonsRightComponent)
  rightButtonComponent!: TeachingDialogButtonsRightComponent;

  // PUBLIC PROPERTIES
  form!: FormGroup;
  isPersonal!: boolean;
  validRequestChangeSchedule!: boolean;
  firstDateAllowRequestChange!: Date;
  requestedChangeSchedule: Nullable<FixedScheduleModel> = null;
  requestChangeToUndeterminedDay = false;
  changed = false;

  readonly cancelRequest$ = new Subject<void>();
  readonly IconConstant = IconConstant;
  readonly noteMaxLength = CoreConstant.NOTE_MAX_LENGTH;

  readonly changeStatus$: Observable<EApiStatus>;
  readonly requestStatus$: Observable<EApiStatus>;
  readonly updateStatus$: Observable<EApiStatus>;
  readonly cancelStatus$: Observable<EApiStatus>;
  readonly requestingChangeSchedule$: Observable<boolean>;
  readonly justRequestedSchedule$: Observable<
    Nullable<SimpleFixedScheduleModel>
  >;

  // PRIVATE PROPERTIES
  private readonly change$: Observable<TeachingDialogChange>;
  private readonly nameTitle$: Observable<string>;

  // GETTERS
  get requestControl(): FormGroup {
    return this.form.controls['request'] as FormGroup;
  }

  get changeControl(): FormGroup {
    return this.form.controls['change'] as FormGroup;
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

  // CONSTRUCTOR
  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: TeachingDialogStore,
    private readonly dialogService: DialogService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private readonly destroy$: TuiDestroyService
  ) {
    this.change$ = store.change$;
    this.nameTitle$ = store.nameTitle$;
    this.changeStatus$ = store.status$('change');
    this.updateStatus$ = store.status$('update');
    this.cancelStatus$ = store.status$('cancel');
    this.requestStatus$ = store.status$('request');
    this.justRequestedSchedule$ = store.justRequestedSchedule$;
    this.requestingChangeSchedule$ = store.requestingChangeSchedule$;
  }

  // LIFECYCLE
  ngOnInit(): void {
    // This function use ```schedule```, which is an @Input, so must be called in ngOnInit
    this.initForm();

    this.handleStatusChange();
    this.handleJustRequestedScheduleChange();
    this.handleChange();
    this.handleCancelRequest();

    this.requestedChangeSchedule =
      this.schedule.FixedSchedules?.find((x) =>
        ChangeStatusHelper.isPending(x.status)
      ) || null;

    this.changeControl.controls['note'].valueChanges
      .pipe(
        withLatestFrom(this.requestingChangeSchedule$),
        filter(({ 1: requestingChangeSchedule }) => !requestingChangeSchedule),
        tap(() => this.rightButtonComponent.markForCheck()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  // PUBLIC METHODS
  toggleRequestArea(open: boolean): void {
    this.store.toggleRequest(open);
  }

  //? Remove
  onUpdate(): void {
    const id = this.schedule.Id;
    if (typeof id !== 'number') {
      return;
    }

    const payload = {
      note: this.changeControl.controls['note'].value as string,
    };

    this.store.update({ id, payload });
  }

  // PRIVATE METHODS
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
          room,
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
                    CoreConstant.REASON_CHANGE_SCHEDULE_MAX_LENGTH
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
              CoreConstant.REASON_CHANGE_SCHEDULE_MAX_LENGTH
            ),
          ],
        ],
      }),
      change: this.fb.group(
        {
          note: [initialChange.note, Validators.maxLength(this.noteMaxLength)],
        },
        { validators: sameGroupStaticValueValidator(initialChange) }
      ),
    });

    this.store.init(initialChange);
  }

  private handleStatusChange(): void {
    this.updateStatus$
      .pipe(
        switchMap((status) => {
          switch (status) {
            case 'successful':
              this.changed = true;
              return this.showNotificationUpdateSuccessful();
            case 'systemError':
              return this.showNotificationError();
          }
          return of({});
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.requestStatus$
      .pipe(
        switchMap((status) => {
          switch (status) {
            case 'successful':
              return this.showNotificationRequestChangeSuccessful();
            case 'systemError':
              return this.showNotificationError();
          }
          return of({});
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.changeStatus$
      .pipe(
        switchMap((status) => {
          switch (status) {
            case 'successful': {
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
              return this.showNotificationUpdateSuccessful();
            }
            case 'systemError':
              return this.showNotificationError();
          }
          return of({});
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.cancelStatus$
      .pipe(
        filter((status) => status === 'successful'),
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
        ObservableHelper.filterNullish(),
        tap((request) => {
          const controls = this.form.controls;
          if (typeof this.schedule.Id !== 'number') {
            return;
          }
          this.updateSchedule.emit({
            ...request,
            idSchedule: this.schedule.Id,
            oldDate: DateHelper.format(
              (controls['start'].value as [TuiDay, TuiTime])[0]
            ),
            oldIdRoom: controls['location'].value as string,
            oldShift: this.schedule.Shift ?? '1',
            isNew: true,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleCancelRequest(): void {
    this.cancelRequest$
      .pipe(
        withLatestFrom(this.nameTitle$),
        switchMap(({ 1: title }) =>
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
              tap((id) => this.store.cancel(id))
            )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleChange(): void {
    this.change$
      .pipe(
        skip(1),
        tap((change) => {
          this.changeControl.setValidators(
            sameGroupStaticValueValidator(change)
          );
          this.changeControl.updateValueAndValidity();
          this.changeScheduleInfo.emit(change);
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showNotificationRequestChangeSuccessful(): Observable<void> {
    return this.alertService.open('Vui lòng chờ phản hồi của trưởng bộ môn', {
      label: 'Gửi yêu cầu thành công',
      status: TuiNotification.Success,
    });
  }

  private showNotificationUpdateSuccessful(): Observable<void> {
    return this.alertService.open('Cập nhật lịch thành công!', {
      status: TuiNotification.Success,
    });
  }

  private showNotificationError(): Observable<void> {
    return this.alertService.open('Vui lòng thử lại sau', {
      label: 'Đã có lỗi xảy ra',
      status: TuiNotification.Error,
    });
  }
}
