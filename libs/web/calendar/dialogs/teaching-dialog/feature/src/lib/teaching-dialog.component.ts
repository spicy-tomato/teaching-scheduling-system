import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { tuiButtonOptionsProvider, TuiDialogContext } from '@taiga-ui/core';
import { ChangeStatusHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangedScheduleModel,
  EjsScheduleModel,
  FixedScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TeachingDialogChange } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';

@Component({
  templateUrl: './teaching-dialog.component.html',
  styleUrls: ['./teaching-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'outline',
      size: 'm',
    }),
  ],
})
export class TeachingDialogComponent {
  /** PUBLIC PROPERTIES */
  readonly IconConstant = IconConstant;
  schedules = this.context.data.schedules;
  openScheduleList = false;
  changedSchedule: ChangedScheduleModel =
    this.context.data.schedules.reduce<ChangedScheduleModel>((acc, curr) => {
      acc[curr.Id] = null;
      return acc;
    }, {});
  selectedSchedule!: EjsScheduleModel;

  /** PRIVATE PROPERTIES */
  private haveOpened = false;
  private needUpdateAfterClose = false;

  /** GETTERS */
  private get currentSelected(): EjsScheduleModel {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.schedules.find((s) => s.Id === this.selectedSchedule.Id)!;
  }

  /** SETTERS */
  private set currentSelected(schedule: EjsScheduleModel) {
    this.schedules = this.schedules.map((s) =>
      s.Id === this.selectedSchedule.Id ? schedule : s
    );
  }

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<
      EjsScheduleModel[],
      { schedules: EjsScheduleModel[]; selectedId: number }
    >
  ) {
    this.onChangeSelectedSchedule(context.data.selectedId);
  }

  /** PUBLIC METHODS */
  toggleScheduleList(open: boolean, needCheck = false): void {
    if (!open || !needCheck || this.haveOpened) {
      this.openScheduleList = open;
      this.haveOpened = true;
    }
  }

  onChangeSelectedSchedule(scheduleId: number): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.selectedSchedule = this.schedules.find((s) => s.Id === scheduleId)!;
  }

  onUpdateSchedule(schedule: FixedScheduleModel): void {
    const copy = { ...this.currentSelected };
    copy.FixedSchedules = [
      schedule,
      ...(this.selectedSchedule.FixedSchedules?.filter((x) => !x.isNew) ?? []),
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
