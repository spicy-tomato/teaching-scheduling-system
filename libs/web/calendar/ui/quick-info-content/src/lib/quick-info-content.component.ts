import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  tuiButtonOptionsProvider,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { TuiTextAreaComponent } from '@taiga-ui/kit';
import { ChangeScheduleHistoryComponent } from '@teaching-scheduling-system/web-shared-ui-dialog';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  EjsScheduleModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, takeUntil, tap } from 'rxjs';
import { QuickInfoContentStore } from './store';

@Component({
  selector: 'tss-quick-info-content',
  templateUrl: './quick-info-content.component.html',
  styleUrls: ['./quick-info-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    QuickInfoContentStore,
    TuiDestroyService,
    tuiButtonOptionsProvider({
      size: 's',
    }),
  ],
})
export class QuickInfoContentComponent implements OnInit {
  // INPUT
  @Input() data!: EjsScheduleModel;

  // VIEWCHILD
  @ViewChild('note') note!: TuiTextAreaComponent;

  // PUBLIC PROPERTIES
  readonly updateStatus$: Observable<EApiStatus>;
  initialEventNote = '';

  // PRIVATE PROPERTIES
  private historyDialog$!: Observable<void>;
  private noteControlHeight = 20;

  // CONSTRUCTOR
  constructor(
    @Inject(forwardRef(() => ScheduleComponent))
    readonly schedule: ScheduleComponent,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private readonly alertService: TuiAlertService,
    private readonly store: QuickInfoContentStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.updateStatus$ = store.status$;
    this.handleStatusChange();
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.initialEventNote = this.data.Note;

    // This function use ```data```, which is an @Input, so must be called in ngOnInit
    this.initDialog();
  }

  // PUBLIC METHODS
  readonly peopleMatcher = (item: string | SimpleModel): boolean =>
    item !== 'self';

  onShowHistory(): void {
    this.historyDialog$.subscribe();
  }

  onNoteChange(): void {
    const currentHeight = this.note.nativeFocusableElement?.clientHeight;
    if (currentHeight && this.noteControlHeight < currentHeight) {
      setTimeout(() => this.schedule.quickPopup.quickPopup.refreshPosition());
      this.noteControlHeight = currentHeight;
    }
  }

  onClickSave(): void {
    if (this.data.Note !== this.initialEventNote) {
      this.store.updateNote({
        id: this.data.Id,
        payload: { note: this.data.Note },
      });
      this.schedule.saveEvent(this.data);
    }
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
  private handleStatusChange(): void {
    this.updateStatus$
      .pipe(
        tap((status) => {
          switch (status) {
            case 'successful':
              this.showNotificationUpdateSuccessful();
              break;
            case 'systemError':
              this.showNotificationError();
              break;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showNotificationUpdateSuccessful(): void {
    this.alertService
      .open('Cập nhật lịch thành công!', {
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private showNotificationError(): void {
    this.alertService
      .open('Vui lòng thử lại sau', {
        label: 'Đã có lỗi xảy ra',
        status: TuiNotification.Error,
      })
      .subscribe();
  }
}
