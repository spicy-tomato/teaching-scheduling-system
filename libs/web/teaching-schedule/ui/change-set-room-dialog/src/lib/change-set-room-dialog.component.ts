import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TuiAppearance,
  tuiButtonOptionsProvider,
  TuiDialogContext,
  TUI_TEXTFIELD_APPEARANCE,
} from '@taiga-ui/core';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './change-set-room-dialog.component.html',
  styleUrls: ['./change-set-room-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
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
  // PUBLIC PROPERTIES
  form!: FormGroup;
  readonly rooms$: Observable<string[]>;

  // CONSTRUCTOR
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: RequestStore,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, ChangeSchedule>
  ) {
    this.rooms$ = store.rooms$;

    this.initForm();
  }

  // PUBLIC METHODS
  confirm(): void {
    const newIdRoom = this.form.controls['newRoom'].value as string;
    this.store.setRoom({ schedule: this.context.data, newIdRoom });
    this.cancel();
  }

  cancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  // PRIVATE METHODS
  private initForm(): void {
    this.form = this.fb.group({
      newRoom: ['', Validators.required],
    });
  }
}
