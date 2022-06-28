import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ChangeScheduleHistoryComponent } from '@teaching-scheduling-system/web-shared-ui-dialog';
import { FixedScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'tss-teaching-dialog-header',
  templateUrl: './teaching-dialog-header.component.html',
  styleUrls: ['./teaching-dialog-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachingDialogHeaderComponent {
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
        new PolymorpheusComponent(
          ChangeScheduleHistoryComponent,
          this.injector
        ),
        {
          data: this.fixedSchedules || [],
          label: 'Lịch sử thay đổi giờ giảng',
        }
      )
      .subscribe();
  }
}
