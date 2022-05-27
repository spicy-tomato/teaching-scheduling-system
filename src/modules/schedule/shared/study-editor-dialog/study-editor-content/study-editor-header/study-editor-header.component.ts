import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { Nullable, FixedScheduleModel } from '@shared/models';
import { TuiDialogService } from '@taiga-ui/core';
import { StudyHistoryDialogComponent } from '../study-history-dialog/study-history-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { IconConstant } from '@shared/constants';

@Component({
  selector: 'tss-study-editor-header',
  templateUrl: './study-editor-header.component.html',
  styleUrls: ['./study-editor-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyEditorHeaderComponent {
  /** PUBLIC PROPERTIES */
  public readonly IconConstant = IconConstant;

  /** INPUT */
  @Input() public fixedSchedules?: Nullable<FixedScheduleModel[]>;

  /** CONSTRUCTOR */
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService)
    private readonly tuiDialogService: TuiDialogService
  ) {}

  /** PUBLIC METHODS */
  public onShowHistory(): void {
    this.tuiDialogService
      .open(
        new PolymorpheusComponent(StudyHistoryDialogComponent, this.injector),
        {
          data: this.fixedSchedules || [],
          label: 'Lịch sử thay đổi giờ giảng',
        }
      )
      .subscribe();
  }
}
