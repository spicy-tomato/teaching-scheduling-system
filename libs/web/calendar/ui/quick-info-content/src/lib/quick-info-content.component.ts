import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { ChangeScheduleHistoryComponent } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  EjsScheduleModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-quick-info-content',
  templateUrl: './quick-info-content.component.html',
  styleUrls: ['./quick-info-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickInfoContentComponent implements OnInit {
  // INPUT
  @Input() data!: EjsScheduleModel;

  // PRIVATE PROPERTIES
  private historyDialog$!: Observable<void>;

  // CONSTRUCTOR
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  // LIFECYCLE
  ngOnInit(): void {
    this.initDialog();
  }

  // PUBLIC METHODS
  readonly peopleMatcher = (item: string | SimpleModel): boolean =>
    item !== 'self';

  onShowHistory(): void {
    this.historyDialog$.subscribe();
  }

  // PRIVATE METHODS
  private initDialog(): void {
    this.historyDialog$ = this.dialogService.open(
      new PolymorpheusComponent(ChangeScheduleHistoryComponent, this.injector),
      {
        data: this.data.FixedSchedules,
        label: 'Lịch sử thay đổi giờ giảng',
      }
    );
  }
}
