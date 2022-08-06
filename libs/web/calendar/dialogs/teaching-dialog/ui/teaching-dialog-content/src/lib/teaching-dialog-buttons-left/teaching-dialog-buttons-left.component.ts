import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { DialogService } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  teachingDialogChange,
  teachingDialogRequest,
  teachingDialogRequestIntend,
  teachingDialogSelectCancelStatus,
  teachingDialogSelectChangeStatus,
  teachingDialogSelectJustRequestedSchedule,
  teachingDialogSelectRequestingChangeSchedule,
  teachingDialogSelectRequestStatus,
  teachingDialogSelectSearchSchedule,
  teachingDialogSelectSearchStatus,
  TeachingDialogState,
  teachingDialogToggleRequestChange,
} from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  FixedScheduleModel,
  RequestChangeSchedulePayload,
  RequestIntendChangeSchedulePayload,
  SimpleFixedScheduleModel,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tss-teaching-dialog-buttons-left',
  templateUrl: './teaching-dialog-buttons-left.component.html',
  styleUrls: ['./teaching-dialog-buttons-left.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class TeachingDialogButtonsLeftComponent implements OnInit {
  /** INPUT */
  @Input() idSchedule!: number;
  @Input() changed!: boolean;
  @Input() validRequestChangeSchedule!: boolean;
  @Input() requestedChangeSchedule!: Nullable<FixedScheduleModel>;
  @Input() isPersonal!: boolean;
  @Input() requestChangeToUndeterminedDay!: boolean;

  /** OUTPUT */
  @Output() changedChange = new EventEmitter<boolean>();

  /** PUBLIC PROPERTIES */
  form!: FormGroup;
  readonly justRequestedSchedule$: Observable<
    Nullable<SimpleFixedScheduleModel>
  >;
  readonly searchStatus$: Observable<EApiStatus>;
  readonly requestingChangeSchedule$: Observable<boolean>;
  readonly searchSchedule$: Observable<Nullable<StudyScheduleModel[]>>;
  readonly requestStatus$: Observable<EApiStatus>;
  readonly changeStatus$: Observable<EApiStatus>;
  readonly cancelStatus$: Observable<EApiStatus>;

  readonly submitRequestChange$ = new Subject<void>();
  readonly submitChange$ = new Subject<void>();

  /** GETTERS */
  get requestControl(): FormGroup {
    return this.form.controls['request'] as FormGroup;
  }

  get requestIntendControl(): FormGroup {
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
    private readonly cdr: ChangeDetectorRef,
    private readonly controlContainer: ControlContainer,
    private readonly dialogService: DialogService,
    private readonly store: Store<TeachingDialogState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.justRequestedSchedule$ = store
      .select(teachingDialogSelectJustRequestedSchedule)
      .pipe(takeUntil(this.destroy$));
    this.searchStatus$ = store
      .select(teachingDialogSelectSearchStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestingChangeSchedule$ = store
      .select(teachingDialogSelectRequestingChangeSchedule)
      .pipe(takeUntil(this.destroy$));
    this.searchSchedule$ = store
      .select(teachingDialogSelectSearchSchedule)
      .pipe(takeUntil(this.destroy$));
    this.requestStatus$ = store
      .select(teachingDialogSelectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.changeStatus$ = store
      .select(teachingDialogSelectChangeStatus)
      .pipe(takeUntil(this.destroy$));
    this.cancelStatus$ = store
      .select(teachingDialogSelectCancelStatus)
      .pipe(takeUntil(this.destroy$));

    this.handleSubmitRequestChange();
    this.handleSubmitChange();
  }

  /** LIFECYCLE */
  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.handleFormChange();
  }

  /** PUBLIC METHODS */
  unfold(): void {
    this.store.dispatch(teachingDialogToggleRequestChange({ open: true }));
  }

  /** PRIVATE METHODS */
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

  private handleFormChange(): void {
    this.requestControl.valueChanges
      .pipe(
        tap(() => {
          if (!this.requestChangeToUndeterminedDay) {
            this.cdr.markForCheck();
          }
        })
      )
      .subscribe();
    this.requestIntendControl.valueChanges
      .pipe(
        tap(() => {
          if (this.requestChangeToUndeterminedDay) {
            this.cdr.markForCheck();
          }
        })
      )
      .subscribe();
  }

  private submitChangeIntendTimeRequest(): void {
    const request = this.requestIntendControl;

    const body: RequestIntendChangeSchedulePayload = {
      idSchedule: this.idSchedule,
      intendTime: request.controls['intendTime'].value as string,
      reason: request.controls['reason'].value as string,
    };

    this.store.dispatch(teachingDialogRequestIntend({ body }));
  }

  private submitChangeRequest(): void {
    const request = this.requestControl;

    const body: RequestChangeSchedulePayload = {
      idSchedule: this.idSchedule,
      newIdRoom: (request.controls['online'].value as boolean) ? 'PHTT' : null,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: request.controls['reason'].value as string,
    };

    this.store.dispatch(teachingDialogRequest({ body }));
  }

  private submitChange(): void {
    const body: RequestChangeSchedulePayload = {
      idSchedule: this.idSchedule,
      newIdRoom: this.roomControlValue,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: 'Trưởng bộ môn thay đổi',
    };

    this.store.dispatch(teachingDialogChange({ body }));
  }
}
