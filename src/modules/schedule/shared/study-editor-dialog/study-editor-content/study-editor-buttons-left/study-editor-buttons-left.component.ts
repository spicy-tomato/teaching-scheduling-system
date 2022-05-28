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
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { DialogService } from '@services/dialog/dialog.service';
import { EApiStatus } from '@shared/enums';
import { DateHelper } from '@shared/helpers';
import {
  FixedScheduleModel,
  Nullable,
  RequestChangeSchedulePayload,
  RequestIntendChangeSchedulePayload,
  SimpleFixedScheduleModel,
  StudyScheduleModel,
} from '@shared/models';
import { TuiDay } from '@taiga-ui/cdk';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import * as fromStudyEditorDialog from '../state';

@Component({
  selector: 'tss-study-editor-buttons-left',
  templateUrl: './study-editor-buttons-left.component.html',
  styleUrls: ['./study-editor-buttons-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyEditorButtonsLeftComponent
  extends BaseComponent
  implements OnInit
{
  /** INPUT */
  @Input() public idSchedule!: number;
  @Input() public changed!: boolean;
  @Input() public validRequestChangeSchedule!: boolean;
  @Input() public requestedChangeSchedule!: Nullable<FixedScheduleModel>;
  @Input() public isPersonal!: boolean;
  @Input() public requestChangeToUndeterminedDay!: boolean;

  /** OUTPUT */
  @Output() public changedChange = new EventEmitter<boolean>();

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly justRequestedSchedule$: Observable<
    Nullable<SimpleFixedScheduleModel>
  >;
  public readonly searchStatus$: Observable<EApiStatus>;
  public readonly requestingChangeSchedule$: Observable<boolean>;
  public readonly searchSchedule$: Observable<Nullable<StudyScheduleModel[]>>;
  public readonly requestStatus$: Observable<EApiStatus>;
  public readonly changeStatus$: Observable<EApiStatus>;
  public readonly cancelStatus$: Observable<EApiStatus>;

  public readonly submitRequestChange$ = new Subject<void>();
  public readonly submitChange$ = new Subject<void>();

  public readonly EApiStatus = EApiStatus;

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
    private readonly cdr: ChangeDetectorRef,
    private readonly controlContainer: ControlContainer,
    private readonly dialogService: DialogService,
    private readonly store: Store<fromStudyEditorDialog.StudyEditorDialogState>
  ) {
    super();

    this.assignSubjects([this.submitRequestChange$, this.submitChange$]);

    this.justRequestedSchedule$ = store
      .select(fromStudyEditorDialog.selectJustRequestedSchedule)
      .pipe(takeUntil(this.destroy$));
    this.searchStatus$ = store
      .select(fromStudyEditorDialog.selectSearchStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestingChangeSchedule$ = store
      .select(fromStudyEditorDialog.selectRequestingChangeSchedule)
      .pipe(takeUntil(this.destroy$));
    this.searchSchedule$ = store
      .select(fromStudyEditorDialog.selectSearchSchedule)
      .pipe(takeUntil(this.destroy$));
    this.requestStatus$ = store
      .select(fromStudyEditorDialog.selectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.changeStatus$ = store
      .select(fromStudyEditorDialog.selectChangeStatus)
      .pipe(takeUntil(this.destroy$));
    this.cancelStatus$ = store
      .select(fromStudyEditorDialog.selectCancelStatus)
      .pipe(takeUntil(this.destroy$));

    this.handleSubmitRequestChange();
    this.handleSubmitChange();
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.handleFormChange();
  }

  /** PUBLIC METHODS */
  public unfold(): void {
    this.store.dispatch(
      fromStudyEditorDialog.toggleRequestChange({ open: true })
    );
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

    this.store.dispatch(fromStudyEditorDialog.requestIntend({ body }));
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

    this.store.dispatch(fromStudyEditorDialog.request({ body }));
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

    this.store.dispatch(fromStudyEditorDialog.change({ body }));
  }
}
