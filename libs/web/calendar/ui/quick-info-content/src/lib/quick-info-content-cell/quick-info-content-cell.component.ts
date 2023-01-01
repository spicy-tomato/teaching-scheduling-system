import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { GoogleEventDialogComponent } from '@teaching-scheduling-system/web/calendar/dialogs/google-event-dialog/feature';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs';

@Component({
  selector: 'tss-quick-info-content-cell',
  templateUrl: './quick-info-content-cell.component.html',
  styleUrls: ['./quick-info-content-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickInfoContentCellComponent {
  // INPUT
  @Input() data!: EjsScheduleModel;

  // PUBLIC PROPERTIES
  newEventTitle = '';

  // CONSTRUCTOR
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  // PUBLIC METHODS
  create(): void {
    this.dialogService
      .open<Partial<EjsScheduleModel> | undefined>(
        new PolymorpheusComponent(GoogleEventDialogComponent, this.injector),
        {
          data: {
            ...this.data,
            Subject: this.newEventTitle,
          },
          label: 'Tạo sự kiện',
          closeable: false,
          dismissible: false,
          size: 'l',
        }
      )
      .pipe(
        ObservableHelper.filterUndefined(),
        tap((newData) => {
          // TODO: Update ejs calendar after create event successfully
          // this.scheduleComponent.saveEvent({ ...data, ...newData });
        })
      )
      .subscribe();
  }
}
