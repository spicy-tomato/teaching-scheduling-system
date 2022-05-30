import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import { ChangeStatusHelper } from '@shared/helpers';
import {
  ChangedScheduleModel,
  EjsScheduleModel,
  FixedScheduleModel,
} from '@shared/models';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { StudyEditorContentComponent } from './study-editor-content/study-editor-content.component';
import * as fromStudyEditorDialog from './study-editor-content/state';

@Component({
  templateUrl: './study-editor-dialog.component.html',
  styleUrls: ['./study-editor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyEditorDialogComponent {
  /** VIEWCHILD */
  @ViewChild(StudyEditorContentComponent)
  public content!: StudyEditorContentComponent;

  /** PUBLIC PROPERTIES */
  public schedules = this.context.data.schedules;
  public selectedSchedule!: EjsScheduleModel;
  public changedSchedule: ChangedScheduleModel =
    this.context.data.schedules.reduce((acc, curr) => {
      acc[curr.Id] = null;
      return acc;
    }, {});

  /** GETTERS */
  private get currentSelected(): EjsScheduleModel {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.schedules.find((s) => s.Id === this.selectedSchedule.Id)!;
  }

  /** SETTERS */
  private set currentSelected(schedule: EjsScheduleModel) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  public onChangeSelectedSchedule(scheduleId: number): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.selectedSchedule = this.schedules.find((s) => s.Id === scheduleId)!;
  }

  public onUpdateSchedule(schedule: FixedScheduleModel): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const copy = { ...this.currentSelected };
    copy.FixedSchedules = [
      schedule,
      ...(this.selectedSchedule.FixedSchedules?.filter((x) => !x.isNew) ?? []),
    ];
    this.currentSelected = copy;
  }

  public onChangeScheduleInfo(changes: fromStudyEditorDialog.Change): void {
    const copy = { ...this.currentSelected };
    copy.Note = changes.note;
    this.currentSelected = copy;
  }

  public onCancelRequest(): void {
    this.currentSelected.FixedSchedules =
      this.selectedSchedule.FixedSchedules?.filter(
        (x) => !x.isNew && !ChangeStatusHelper.isPending(x.status)
      );
  }

  public onCancel(): void {
    setTimeout(() => {
      this.context.completeWith(this.schedules);
    });
  }
}
