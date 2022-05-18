import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialog } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiDialogOptions,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ConfirmDialogOptions } from '../dialog-options';

@Component({
  selector: 'tss-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
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
  ],
})
export class ConfirmDialogComponent<T extends ConfirmDialogOptions> {
  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialog<TuiDialogOptions<T>, boolean>
  ) {}

  /** PUBLIC METHODS */
  public onClick(response: boolean): void {
    setTimeout(() => {
      this.context.completeWith(response);
    });
  }
}
