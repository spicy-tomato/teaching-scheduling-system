import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { tuiButtonOptionsProvider, TuiDialogContext } from '@taiga-ui/core';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { ChangeStatusHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  TeachingDialogChange,
  TeachingDialogStore,
} from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import {
  ChangedScheduleModel,
  TssTeachingModel,
  FixedScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './teaching-dialog.component.html',
  styleUrls: ['./teaching-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TeachingDialogStore,
    tuiButtonOptionsProvider({
      appearance: 'outline',
      size: 'm',
    }),
  ],
})
export class TeachingDialogComponent {
  // PUBLIC PROPERTIES
  readonly IconConstant = IconConstant;
  schedules = this.context.data.schedules;
  openScheduleList = false;
  changedSchedule: ChangedScheduleModel =
    this.context.data.schedules.reduce<ChangedScheduleModel>((acc, { Id }) => {
      acc[Id] = null;
      return acc;
    }, {});
  selectedSchedule!: TssTeachingModel;

  // PRIVATE PROPERTIES
  private haveOpened = false;
  private needUpdateAfterClose = false;

  // GETTERS
  private get currentSelected(): TssTeachingModel {
    return (
      this.schedules.find(({ Id }) => Id === this.selectedSchedule.Id) ||
      this.selectedSchedule
    );
  }

  // SETTERS
  private set currentSelected(schedule: TssTeachingModel) {
    this.schedules = this.schedules.map((s) => {
      if (s.Id === this.selectedSchedule.Id) {
        this.selectedSchedule = schedule;
        return schedule;
      }
      return s;
    });
  }

  // CONSTRUCTOR
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<
      TssTeachingModel[],
      { schedules: TssTeachingModel[]; selectedId: number }
    >
  ) {
    this.onChangeSelectedSchedule(context.data.selectedId);
  }

  // PUBLIC METHODS
  toggleScheduleList(open: boolean, needCheck = false): void {
    if (!open || !needCheck || this.haveOpened) {
      this.openScheduleList = open;
      this.haveOpened = true;
    }
  }

  onChangeSelectedSchedule(scheduleId: number | string): void {
    const newSelectSchedule = this.schedules.find(
      ({ Id }) => Id === scheduleId
    );
    if (newSelectSchedule) {
      this.selectedSchedule = newSelectSchedule;
    }
  }

  onUpdateSchedule(schedule: FixedScheduleModel): void {
    const copy = { ...this.currentSelected };
    copy.FixedSchedules = [
      schedule,
      ...(this.selectedSchedule.FixedSchedules?.filter(({ isNew }) => !isNew) ??
        []),
    ];
    this.currentSelected = copy;
    this.needUpdateAfterClose = true;
  }

  onChangeScheduleInfo(changes: TeachingDialogChange): void {
    const copy = { ...this.currentSelected };
    copy.Note = changes.note;
    this.currentSelected = copy;
    this.needUpdateAfterClose = true;
  }

  onCancelRequest(): void {
    this.currentSelected.FixedSchedules =
      this.selectedSchedule.FixedSchedules?.filter(
        (x) => !x.isNew && !ChangeStatusHelper.isPending(x.status)
      );
  }

  onCancel(): void {
    setTimeout(() => {
      if (this.needUpdateAfterClose) {
        this.context.completeWith(this.schedules);
      } else {
        this.context.$implicit.complete();
      }
    });
  }
}
