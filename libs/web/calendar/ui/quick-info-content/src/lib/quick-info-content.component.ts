import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { ChangeScheduleHistoryComponent } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  EjsScheduleModel,
  FixedScheduleModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'tss-quick-info-content',
  templateUrl: './quick-info-content.component.html',
  styleUrls: ['./quick-info-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickInfoContentComponent {
  /** INPUT */
  @Input() public data!: EjsScheduleModel;

  /** PUBLIC PROPERTIES */
  public readonly peopleMatcher = (item: string | SimpleModel): boolean =>
    item !== 'self';

  /** CONSTRUCTOR */
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  /** PUBLIC METHODS */
  public onShowHistory(fixedSchedules: FixedScheduleModel[]): void {
    this.dialogService
      .open(
        new PolymorpheusComponent(
          ChangeScheduleHistoryComponent,
          this.injector
        ),
        {
          data: fixedSchedules,
          label: 'Lịch sử thay đổi giờ giảng',
        }
      )
      .subscribe();
  }
}
