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
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { DialogService } from '@teaching-scheduling-system/web-shared-ui-dialog';
import { TeachingDialogStore } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
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
  // INPUT
  @Input() idSchedule!: number;
  @Input() changed!: boolean;
  @Input() validRequestChangeSchedule!: boolean;
  @Input() requestedChangeSchedule!: Nullable<FixedScheduleModel>;
  @Input() isPersonal!: boolean;
  @Input() requestChangeToUndeterminedDay!: boolean;

  // OUTPUT
  @Output() changedChange = new EventEmitter<boolean>();

  // PUBLIC PROPERTIES
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

  // GETTERS
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

  // CONSTRUCTOR
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly controlContainer: ControlContainer,
    private readonly dialogService: DialogService,
    private readonly store: TeachingDialogStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.changeStatus$ = store.status$('change');
    this.cancelStatus$ = store.status$('cancel');
    this.searchStatus$ = store.status$('search');
    this.requestStatus$ = store.status$('request');
    this.searchSchedule$ = store.searchSchedule$;
    this.justRequestedSchedule$ = store.justRequestedSchedule$;
    this.requestingChangeSchedule$ = store.requestingChangeSchedule$;

    this.handleSubmitRequestChange();
    this.handleSubmitChange();
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.handleFormChange();
  }

  // PUBLIC METHODS
  unfold(): void {
    this.store.toggleRequest(true);
  }

  // PRIVATE METHODS
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

    const payload: RequestIntendChangeSchedulePayload = {
      idSchedule: this.idSchedule,
      intendTime: request.controls['intendTime'].value as string,
      reason: request.controls['reason'].value as string,
    };

    this.store.requestIntend(payload);
  }

  private submitChangeRequest(): void {
    const request = this.requestControl;

    const payload: RequestChangeSchedulePayload = {
      idSchedule: this.idSchedule,
      newIdRoom: (request.controls['online'].value as boolean) ? 'PHTT' : null,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: request.controls['reason'].value as string,
    };

    this.store.request(payload);
  }

  private submitChange(): void {
    const payload: RequestChangeSchedulePayload = {
      idSchedule: this.idSchedule,
      newIdRoom: this.roomControlValue,
      newShift: this.shiftControlValue,
      newDate: DateHelper.toDateOnlyString(
        this.dateControlValue.toUtcNativeDate()
      ),
      reason: 'Trưởng bộ môn thay đổi',
    };

    this.store.change(payload);
  }
}
