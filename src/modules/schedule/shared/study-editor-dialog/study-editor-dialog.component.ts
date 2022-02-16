import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TuiAppearance,
  TuiDialogContext,
  TuiNotification,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { DateHelper } from '@shared/helpers';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import {
  EjsScheduleModel,
  ChangedScheduleModel,
  Nullable,
  SimpleFixedScheduleModel,
  StudyScheduleModel,
} from 'src/shared/models';
import { CoreConstant } from '@shared/constants';
import { sameValueValidator } from 'src/shared/validators';
import { TuiDay } from '@taiga-ui/cdk';
import { sqlDateFactory } from '@shared/factories';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { EApiStatus } from '@shared/enums';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromStudyEditorDialog from './state';
import { Store } from '@ngrx/store';
import { DialogService } from '@services/dialog/dialog.service';

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
  public validRequestChangeSchedule!: boolean;
  public firstDateAllowRequestChange!: Date;

  public readonly requestStatus$: Observable<EApiStatus>;
  public readonly updateStatus$: Observable<EApiStatus>;
  public readonly searchStatus$: Observable<EApiStatus>;
  public readonly requestingChangeSchedule$: Observable<boolean>;
  public readonly justRequestedSchedule$: Observable<
    Nullable<SimpleFixedScheduleModel>
  >;
  public readonly searchSchedule$: Observable<Nullable<StudyScheduleModel[]>>;

  public readonly cancel$ = new Subject();
  public readonly submitRequestChange$ = new Subject();

  public readonly EApiStatus = EApiStatus;
  public readonly data: EjsScheduleModel;
  public readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  public readonly noteMaxLength = 1000;
  public readonly reasonMaxLength = 500;

  /** PRIVATE PROPERTIES */
  private readonly change$: Observable<fromStudyEditorDialog.Change>;

  /** GETTERS */
  private get requestControl(): FormGroup {
    return this.form.controls['request'] as FormGroup;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store<fromStudyEditorDialog.StudyEditorDialogState>,
    private readonly dialogService: DialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      Nullable<ChangedScheduleModel>,
      EjsScheduleModel
    >,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.data = context.data;
    this.initForm();

    this.requestStatus$ = store
      .select(fromStudyEditorDialog.selectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.updateStatus$ = store
      .select(fromStudyEditorDialog.selectUpdateStatus)
      .pipe(takeUntil(this.destroy$));
    this.searchStatus$ = store
      .select(fromStudyEditorDialog.selectSearchStatus)
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

    this.handleStatusChange();
    this.handleChange();
    this.handleSubmitRequestChange();
    this.handleCancel();
  }

  /** PUBLIC METHODS */
  public toggleRequestArea(open: boolean): void {
    this.store.dispatch(fromStudyEditorDialog.toggleRequestChange({ open }));
  }

  public onUpdate(): void {
    const body = {
      note: (this.form.controls['change'] as FormGroup).controls['note']
        .value as string,
      id: this.form.controls['id'].value as number,
    };

    this.store.dispatch(fromStudyEditorDialog.update({ body }));
  }

  public onChangeRequest(): void {
    if (this.form.controls['request'].errors?.sameValue) {
      return;
    }

    const request = this.requestControl;

    const date = DateHelper.toDateOnlyString(
      (request.controls['date'].value as TuiDay).toUtcNativeDate()
    );

    this.store.dispatch(
      fromStudyEditorDialog.search({
        params: {
          start: date,
          end: date,
          shift: request.controls['shift'].value as string,
        },
      })
    );
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    const startDate = this.data.StartTime as Date;
    const endDate = this.data.EndTime as Date;
    const today = new Date();
    const startTuiDate = startDate
      ? DateHelper.toTuiDay(startDate)
      : DateHelper.toTuiDay(today);
    const endTuiDate = endDate
      ? DateHelper.toTuiDay(endDate)
      : DateHelper.toTuiDay(today);
    const room = this.data.Location;

    const initialRequest = {
      date: startTuiDate,
      shift: this.data.Shift ?? '1',
      online: room === 'PHTT',
    };

    const initialChange = {
      note: this.data.Note ?? '',
    };

    this.form = this.fb.group({
      id: [this.data.Id],
      subject: [this.data.Subject],
      location: [room],
      people: [this.data.People?.[0]],
      start: [[startTuiDate, DateHelper.beautifyTime(startDate ?? today)]],
      end: [[endTuiDate, DateHelper.beautifyTime(endDate ?? today)]],
      request: this.fb.group(
        {
          shift: [initialRequest.shift],
          date: [initialRequest.date, Validators.required],
          online: [initialRequest.online],
          reason: [
            '',
            [Validators.required, Validators.maxLength(this.reasonMaxLength)],
          ],
        },
        {
          validators: sameValueValidator(initialRequest),
        }
      ),
      change: this.getNewChangeControl(initialChange),
    });

    const todayToZero = DateHelper.dateAtZero(today);
    this.firstDateAllowRequestChange =
      startDate < todayToZero
        ? DateHelper.subtract(todayToZero, 3)
        : todayToZero;
    this.validRequestChangeSchedule =
      startDate > this.firstDateAllowRequestChange &&
      this.data.People?.[0] === 'self';

    this.store.dispatch(fromStudyEditorDialog.reset({ change: initialChange }));
  }

  private handleStatusChange(): void {
    this.updateStatus$
      .pipe(
        tap((status) => {
          switch (status) {
            case EApiStatus.successful:
              this.showNotificationUpdateSuccessful();
              break;
            case EApiStatus.systemError:
              this.showNotificationError();
              break;
          }
        })
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
        })
      )
      .subscribe();
  }

  private handleCancel(): void {
    this.cancel$
      .pipe(
        withLatestFrom(this.change$, this.justRequestedSchedule$),
        map(({ 1: update, 2: request }) => ({ update, request })),
        tap(({ update, request }) => {
          setTimeout(() => {
            this.context.completeWith({
              to: request,
              note: update.note,
            });
          });
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

    const body = {
      idSchedule: this.form.controls['id'].value as number,
      newIdRoom: (request.controls['online'].value as boolean) ? 'PHTT' : null,
      newShift: request.controls['shift'].value as string,
      newDate: DateHelper.toDateOnlyString(
        (request.controls['date'].value as TuiDay).toUtcNativeDate()
      ),
      reason: request.controls['reason'].value as string,
      timeRequest: sqlDateFactory(),
    };

    this.store.dispatch(fromStudyEditorDialog.request({ body }));
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
        validators: sameValueValidator(value),
      }
    );
  }
}
