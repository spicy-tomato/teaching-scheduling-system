import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialog } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider, TuiDialogOptions } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ConfirmDialogOptions } from '../dialog-options';

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
  ],
})
export class ConfirmDialogComponent<T extends ConfirmDialogOptions> {
  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialog<TuiDialogOptions<T>, boolean>
  ) {}

  /** PUBLIC METHODS */
  onClick(response: boolean): void {
    setTimeout(() => {
      this.context.completeWith(response);
    });
  }
}
