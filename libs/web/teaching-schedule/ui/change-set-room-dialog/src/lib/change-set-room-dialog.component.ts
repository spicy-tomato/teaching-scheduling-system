import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  tuiButtonOptionsProvider,
  TuiDialogContext,
  TUI_TEXTFIELD_APPEARANCE,
} from '@taiga-ui/core';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectRooms,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  teachingScheduleRequestSetRoom,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable, takeUntil } from 'rxjs';

@Component({
  templateUrl: './change-set-room-dialog.component.html',
  styleUrls: ['./change-set-room-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
    {
      provide: TUI_TEXTFIELD_APPEARANCE,
      useValue: TuiAppearance.Textfield,
    },
  ],
})
export class ChangeSetRoomDialogComponent {
  /** PUBLIC PROPERTIES */
  form!: FormGroup;
  readonly rooms$: Observable<string[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<TeachingScheduleRequestState>,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, ChangeSchedule>,
    appShellStore: Store<AppShellState>,
    destroy$: TuiDestroyService
  ) {
    this.rooms$ = appShellStore.select(selectRooms).pipe(takeUntil(destroy$));

    this.initForm();
  }

  /** PUBLIC METHODS */
  confirm(): void {
    const newIdRoom = this.form.controls['newRoom'].value as string;
    this.store.dispatch(
      teachingScheduleRequestSetRoom({ schedule: this.context.data, newIdRoom })
    );
    this.cancel();
  }

  cancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      newRoom: ['', Validators.required],
    });
  }
}
