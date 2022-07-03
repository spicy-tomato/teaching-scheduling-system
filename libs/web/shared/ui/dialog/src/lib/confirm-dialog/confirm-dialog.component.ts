import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { TuiDialog } from '@taiga-ui/cdk';
import {
  TUI_BUTTON_OPTIONS,
  TuiAppearance,
  TuiDialogOptions,
} from '@taiga-ui/core';
import { ConfirmDialogOptions } from '../dialog-options';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
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
