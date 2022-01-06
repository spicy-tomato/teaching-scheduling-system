import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ScheduleService } from '@services/schedule.service';
import {
  TuiAppearance,
  TuiDialogContext,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { DateHelper } from '@shared/helpers';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { EjsScheduleModel, Nullable } from 'src/shared/models';
import { CoreConstant } from '@shared/constants';
import {
  beforeTodayValidator,
  notContainValueValidator,
  sameValueValidator,
} from 'src/shared/validators';
import { Observable } from 'rxjs';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { TuiDay } from '@taiga-ui/cdk';
import { sqlDateFactory } from '@shared/factories';

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
  public requestingChangeSchedule = false;
  public sending = false;
  public validRequestChangeSchedule = true;
  public rooms$: Observable<string[]>;

  public readonly shifts = CoreConstant.SHIFTS;
  public readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  public readonly noteMaxLength = 1000;

  /** GETTERS */
  public get people(): Nullable<AbstractControl> {
    return this.form.get('people');
  }

  public get note(): Nullable<AbstractControl> {
    return this.form.get('note');
  }

  /** CONSTRUCTOR */
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, EjsScheduleModel>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.rooms$ = appShellStore
      .select(fromAppShell.selectRooms)
      .pipe(takeUntil(this.destroy$));

    this.triggerInitForm(context.data);
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    const request = this.form.get('request');
    if (!request) return;

    this.sending = true;

    const idSchedule = parseInt(this.form.get('id')?.value as string);
    const newIdRoom = request.get('room')?.value as string;
    const newShift = request.get('shift')?.value as string;
    const newDate = DateHelper.toDateOnlyString(
      (request.get('date')?.value as TuiDay).toLocalNativeDate()
    );

    this.scheduleService
      .requestChangeSchedule({
        idSchedule,
        newDate,
        newIdRoom,
        newShift,
        timeRequest: sqlDateFactory(),
      })
      .subscribe(
        () => {
          this.sending = false;
          this.context.completeWith(true);
        },
        () => {
          this.sending = false;
          this.context.completeWith(false);
        }
      );
  }

  public onClickRequestingChangeSchedule(): void {
    this.requestingChangeSchedule = true;
  }

  public onClickCancelRequestingChangeSchedule(): void {
    this.requestingChangeSchedule = false;
  }

  public onCancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  /** PRIVATE METHODS */
  private triggerInitForm(data: EjsScheduleModel): void {
    this.rooms$.pipe(tap((rooms) => this.initForm(data, rooms))).subscribe();
  }

  private initForm(data: EjsScheduleModel, rooms: string[]): void {
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

    const initialRequest = {
      note: data.Note,
      date: startTuiDate,
      shift: data.Shift ?? '1',
      room,
    };

    this.form = this.fb.group({
      id: [data.Id],
      subject: [data.Subject],
      location: [room],
      people: [data.People?.[0]],
      start: [[startTuiDate, DateHelper.beautifyTime(startDate ?? today)]],
      end: [[endTuiDate, DateHelper.beautifyTime(endDate ?? today)]],
      request: this.fb.group(
        {
          note: [initialRequest.note],
          shift: [initialRequest.shift],
          date: [initialRequest.date, beforeTodayValidator()],
          room: [
            initialRequest.room,
            notContainValueValidator(rooms, 'Mã phòng'),
          ],
        },
        {
          validators: sameValueValidator(initialRequest),
        }
      ),
    });

    this.validRequestChangeSchedule = startDate > new Date();
  }
}
