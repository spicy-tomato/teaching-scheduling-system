import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { tuiButtonOptionsProvider, TuiDialogService } from '@taiga-ui/core';
import { ExamAssignStore } from '@teaching-scheduling-system/web/exam/data-access';
import { AssignEditDialogComponent } from '@teaching-scheduling-system/web/exam/ui/assign-edit-dialog';
import { AssignTeacherDialogComponent } from '@teaching-scheduling-system/web/exam/ui/assign-teacher-dialog';
import { ExamScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs';

@Component({
  selector: 'tss-assign-list',
  templateUrl: './assign-list.component.html',
  styleUrls: ['./assign-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'icon',
      size: 'l',
    }),
  ],
})
export class AssignListComponent {
  // PUBLIC PROPERTIES 
  readonly columns = [
    'index',
    'name',
    'method',
    'credit',
    'date',
    'time',
    'room',
    'numberOfStudents',
    'teacher',
    'action',
  ];
  readonly data$ = this.store.data$;
  readonly status$ = this.store.status$;

  // CONSTRUCTOR 
  constructor(
    private readonly store: ExamAssignStore,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}

  // PUBLIC METHOD 
  onOpenAssignDialog(exam: ExamScheduleModel): void {
    this.dialogService
      .open<string[]>(
        new PolymorpheusComponent(AssignTeacherDialogComponent, this.injector),
        {
          label: 'Phân lịch thi',
          data: exam,
        }
      )
      .pipe(tap((teachers) => this.store.updateExam(exam.id, { teachers })))
      .subscribe();
  }

  onOpenEditDialog(exam: ExamScheduleModel): void {
    this.dialogService
      .open<string>(
        new PolymorpheusComponent(AssignEditDialogComponent, this.injector),
        {
          label: 'Cập nhật lịch thi',
          data: exam,
        }
      )
      .pipe(tap((idRoom) => this.store.updateExam(exam.id, { idRoom })))
      .subscribe();
  }
}
