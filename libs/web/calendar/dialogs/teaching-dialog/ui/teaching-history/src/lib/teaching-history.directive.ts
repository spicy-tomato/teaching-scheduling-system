import {
  Directive,
  HostListener,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ChangeScheduleHistoryComponent } from '@teaching-scheduling-system/web-shared-ui-dialog';
import { FixedScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Directive({
  selector: '[tssTeachingHistory]',
})
export class TeachingHistoryDirective {
  // INPUT
  @Input('tssTeachingHistory') fixedSchedules!: Nullable<FixedScheduleModel[]>;

  // CONSTRUCTOR
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService)
    private readonly tuiDialogService: TuiDialogService
  ) {}

  // PUBLIC METHODS
  @HostListener('click') onClick(): void {
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
