import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeSchedule } from '@shared/models';
import {
  TUI_BUTTON_OPTIONS,
  TuiAppearance,
  TUI_TEXTFIELD_APPEARANCE,
  TuiDialogContext,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromRequests from '../../state';

@Component({
  templateUrl: './set-room-dialog.component.html',
  styleUrls: ['./set-room-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 'm',
      },
    },
    {
      provide: TUI_TEXTFIELD_APPEARANCE,
      useValue: TuiAppearance.Textfield,
    },
  ],
})
export class SetRoomDialogComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly rooms$: Observable<string[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromRequests.RequestsState>,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, ChangeSchedule>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.rooms$ = appShellStore
      .select(fromAppShell.selectRooms)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
  }

  /** PUBLIC METHODS */
  public confirm(): void {
    const newIdRoom = this.form.controls['newRoom'].value as string;
    this.store.dispatch(
      fromRequests.setRoom({ schedule: this.context.data, newIdRoom })
    );
    this.cancel();
  }

  public cancel(): void {
    this.context.$implicit.complete();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      newRoom: ['', Validators.required],
    });
  }
}
