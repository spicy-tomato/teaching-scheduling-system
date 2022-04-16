import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TuiAppearance,
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { DateHelper, ObservableHelper } from '@shared/helpers';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import {
  EjsScheduleModel,
  ChangedScheduleModel,
  Nullable,
  StudyScheduleModel,
  SimpleFixedScheduleModel,
  FixedScheduleModel,
  RequestChangeSchedulePayload,
  SimpleModel,
  Teacher,
} from 'src/shared/models';
import { CoreConstant } from '@shared/constants';
import { sameValueValidator } from 'src/shared/validators';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import {
  filter,
  map,
  mergeMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { iif, Observable, of, Subject } from 'rxjs';
import { EApiStatus } from '@shared/enums';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromStudyEditorDialog from './state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { DialogService } from '@services/dialog/dialog.service';
import { IconConstant } from '@shared/constants/components/icon.constant';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { StudyHistoryDialogComponent } from './study-history-dialog/study-history-dialog.component';

@Component({
  templateUrl: './study-editor-dialog.component.html',
  styleUrls: ['./study-editor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
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
export class StudyEditorDialogComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public isPersonal!: boolean;
  public validRequestChangeSchedule!: boolean;
  public firstDateAllowRequestChange!: Date;
  public requestedChangeSchedule: Nullable<FixedScheduleModel>;
  public requestChangeToUndeterminedDay = false;

  public readonly teacher$: Observable<Nullable<Teacher>>;
  public readonly changeStatus$: Observable<EApiStatus>;
  public readonly requestStatus$: Observable<EApiStatus>;
  public readonly updateStatus$: Observable<EApiStatus>;
  public readonly searchStatus$: Observable<EApiStatus>;
  public readonly cancelStatus$: Observable<EApiStatus>;
  public readonly requestingChangeSchedule$: Observable<boolean>;
  public readonly justRequestedSchedule$: Observable<
    Nullable<SimpleFixedScheduleModel>
  >;
  public readonly searchSchedule$: Observable<Nullable<StudyScheduleModel[]>>;
  public readonly rooms$: Observable<string[]>;

  public readonly cancel$ = new Subject();
  public readonly cancelRequest$ = new Subject();
  public readonly changeRequest$ = new Subject();
  public readonly submitRequestChange$ = new Subject();
  public readonly submitChange$ = new Subject();

  public readonly IconConstant = IconConstant;
  public readonly EApiStatus = EApiStatus;
  public readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  public readonly noteMaxLength = 1000;
  public readonly reasonMaxLength = 500;
  public readonly intendTimeMaxLength = 100;

  /** PRIVATE PROPERTIES */
  private changed = false;

  private readonly change$: Observable<fromStudyEditorDialog.Change>;
  private readonly nameTitle$: Observable<string>;

  /** GETTERS */
  public get requestControl(): FormGroup {
    return this.form.controls['request'] as FormGroup;
  }

  public get requestIntendControl(): FormGroup {
    return this.form.controls['requestIntend'] as FormGroup;
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
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<
      Nullable<ChangedScheduleModel>,
      EjsScheduleModel
    >,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store<fromStudyEditorDialog.StudyEditorDialogState>,
    private readonly dialogService: DialogService,
    @Inject(TuiDialogService)
    private readonly tuiDialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([
      this.cancel$,
      this.cancelRequest$,
      this.changeRequest$,
      this.submitRequestChange$,
      this.submitChange$,
    ]);

    this.initForm();

    this.teacher$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(takeUntil(this.destroy$));
    this.changeStatus$ = store
      .select(fromStudyEditorDialog.selectChangeStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestStatus$ = store
      .select(fromStudyEditorDialog.selectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.updateStatus$ = store
      .select(fromStudyEditorDialog.selectUpdateStatus)
      .pipe(takeUntil(this.destroy$));
    this.searchStatus$ = store
      .select(fromStudyEditorDialog.selectSearchStatus)
      .pipe(takeUntil(this.destroy$));
    this.cancelStatus$ = store
      .select(fromStudyEditorDialog.selectCancelStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestingChangeSchedule$ = store
      .select(fromStudyEditorDialog.selectRequestingChangeSchedule)
      .pipe(takeUntil(this.destroy$));
    this.justRequestedSchedule$ = store
      .select(fromStudyEditorDialog.selectJustRequestedSchedule)
      .pipe(takeUntil(this.destroy$));
    this.change$ = store
      .select(fromStudyEditorDialog.selectChange)
      .pipe(takeUntil(this.destroy$));
    this.searchSchedule$ = store
      .select(fromStudyEditorDialog.selectSearchSchedule)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(fromAppShell.selectNameTitle)
      .pipe(takeUntil(this.destroy$));
    this.rooms$ = appShellStore
      .select(fromAppShell.selectRooms)
      .pipe(takeUntil(this.destroy$));

    this.handleStatusChange();
    this.handleJustRequestedScheduleChange();
    this.handleChange();
    this.handleChangeRequest();
    this.handleSubmitRequestChange();
    this.handleSubmitChange();
    this.handleCancel();
    this.handleCancelRequest();

    this.requestedChangeSchedule =
      this.context.data.FixedSchedules?.find(
        (x) => x.status === 0 || x.status === 1
      ) || null;
  }

  /** PUBLIC METHODS */
  public onShowHistory(): void {
    this.tuiDialogService
      .open(
        new PolymorpheusComponent(StudyHistoryDialogComponent, this.injector),
        {
          data: this.context.data.FixedSchedules || [],
          label: 'Lịch sử thay đổi giờ giảng',
        }
      )
      .subscribe();
  }

  public toggleRequestArea(open: boolean): void {
    this.store.dispatch(fromStudyEditorDialog.toggleRequestChange({ open }));
  }

  public onUpdate(): void {
    const body = {
      note: (this.form.controls['change'] as FormGroup).controls['note']
        .value as string,
      id: this.context.data.Id,
    };

    this.store.dispatch(fromStudyEditorDialog.update({ body }));
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    const data = this.context.data;

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
                  Validators.maxLength(this.reasonMaxLength),
                ]
              : [],
          ],
        },
        {
          validators: sameValueValidator(initialRequest, {
            date: (a: Nullable<TuiDay>, b: Nullable<TuiDay>) =>
              !!a && !!b && a.daySame(b),
          }),
        }
      ),
      requestIntend: this.fb.group({
        intendTime: [
          '',
          [Validators.required, Validators.maxLength(this.intendTimeMaxLength)],
        ],
        reason: [
          '',
          [Validators.required, Validators.maxLength(this.reasonMaxLength)],
        ],
      }),
      change: this.getNewChangeControl(initialChange),
    });

    this.store.dispatch(fromStudyEditorDialog.reset({ change: initialChange }));
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
          this.context.data.FixedSchedules =
            this.context.data.FixedSchedules?.filter((x) => !x.isNew);
          this.requestedChangeSchedule = null;
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

                this.context.data.FixedSchedules?.push({
                  ...request,
                  idSchedule: this.context.data.Id,
                  oldDate: (
                    controls['start'].value as [TuiDay, TuiTime]
                  )[0].getFormattedDay('YMD', '-'),
                  oldIdRoom: controls['location'].value as string,
                  oldShift: this.context.data.Shift ?? '1',
                  isNew: true,
                });
              })
            )
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleCancel(): void {
    this.cancel$
      .pipe(
        withLatestFrom(this.change$),
        map(({ 1: update }) => update),
        tap((update) => {
          setTimeout(() => {
            this.context.completeWith({
              id: this.context.data.Id,
              fixedSchedules: this.context.data.FixedSchedules ?? null,
              schedule: {
                change: this.changed,
                note: update.note,
                data: {
                  id: this.context.data.Id,
                  idRoom: this.roomControlValue,
                  shift: this.shiftControlValue,
                  date: this.dateControlValue.toUtcNativeDate(),
                },
              },
            });
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
                  this.context.data.FixedSchedules?.find(
                    (x) => x.status === 0 || x.status === 1
                  )?.id
              ),
              ObservableHelper.filterNullish(),
              tap((id) => {
                this.store.dispatch(fromStudyEditorDialog.cancel({ id }));
              })
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleChangeRequest(): void {
    this.changeRequest$
      .pipe(
        withLatestFrom(this.teacher$),
        map(({ 1: teacher }) => teacher),
        tap((teacher) => {
          if (this.requestControl.errors?.sameValue || !this.dateControlValue) {
            return;
          }

          const date = DateHelper.toDateOnlyString(
            this.dateControlValue.toUtcNativeDate()
          );

          this.store.dispatch(
            fromStudyEditorDialog.search({
              params: {
                date: [date, date],
                shift:
                  this.shiftControlValue[0] === '5'
                    ? '5_1,5_2'
                    : this.shiftControlValue,
              },
              teacherId:
                (this.isPersonal
                  ? teacher?.id
                  : (this.context.data.People?.[0] as Teacher).id) || '',
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSubmitRequestChange(): void {
    this.submitRequestChange$
      .pipe(
        withLatestFrom(this.searchSchedule$),
        map(({ 1: searchSchedule }) => searchSchedule),
        tap((searchSchedule) => {
          if (this.requestChangeToUndeterminedDay) {
            this.submitChangeIntendTimeRequest();
            return;
          }

          if (searchSchedule?.length) {
            this.dialogService
              .showConfirmDialog({
                header:
                  'Ca học này đã bị trùng lớp học phần khác. Vẫn tiếp tục?',
              })
              .pipe(
                filter((confirm) => confirm),
                tap(() => this.submitChangeRequest())
              )
              .subscribe();
          } else {
            this.submitChangeRequest();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSubmitChange(): void {
    this.submitChange$
      .pipe(
        withLatestFrom(this.searchSchedule$),
        map(({ 1: searchSchedule }) => searchSchedule),
        tap((searchSchedule) => {
          if (searchSchedule?.length) {
            this.dialogService
              .showConfirmDialog({
                header:
                  'Ca học này đã bị trùng lớp học phần khác. Vẫn tiếp tục?',
              })
              .pipe(
                filter((confirm) => confirm),
                tap(() => this.submitChange())
              )
              .subscribe();
          } else {
            this.submitChange();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleChange(): void {
    this.change$
      .pipe(
        tap((change) => {
          (this.form.controls['change'] as FormGroup) =
            this.getNewChangeControl(change);
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private submitChangeRequest(): void {
    const request = this.requestControl;

    const body: RequestChangeSchedulePayload = {
      idSchedule: this.context.data.Id,
      newIdRoom: (request.controls['online'].value as boolean) ? 'PHTT' : null,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: request.controls['reason'].value as string,
    };

    this.store.dispatch(fromStudyEditorDialog.request({ body }));
  }

  private submitChangeIntendTimeRequest(): void {
    const request = this.requestControl;

    const body: RequestChangeSchedulePayload = {
      idSchedule: this.context.data.Id,
      newIdRoom: (request.controls['online'].value as boolean) ? 'PHTT' : null,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: request.controls['reason'].value as string,
    };

    this.store.dispatch(fromStudyEditorDialog.request({ body }));
  }

  private submitChange(): void {
    const body: RequestChangeSchedulePayload = {
      idSchedule: this.context.data.Id,
      newIdRoom: this.roomControlValue,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: 'Trưởng bộ môn thay đổi',
    };

    this.store.dispatch(fromStudyEditorDialog.change({ body }));
  }

  private showNotificationRequestChangeSuccessful(): void {
    this.notificationsService
      .show('Hãy chờ phản hồi của trưởng bộ môn', {
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

  private showNotificationError(): void {
    this.notificationsService
      .show('Hãy thử lại sau', {
        label: 'Đã có lỗi xảy ra',
        status: TuiNotification.Error,
      })
      .subscribe();
  }

  private getNewChangeControl(value: fromStudyEditorDialog.Change): FormGroup {
    return this.fb.group(
      {
        note: [value.note],
      },
      {
        validators: sameValueValidator(value, {
          date: (a: Nullable<TuiDay>, b: Nullable<TuiDay>) =>
            !!a && !!b && a.daySame(b),
        }),
      }
    );
  }
}
