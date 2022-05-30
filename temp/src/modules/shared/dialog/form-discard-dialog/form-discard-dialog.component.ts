import { Component, Inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialog } from '@taiga-ui/cdk';

@Component({
  selector: 'tss-form-discard-dialog',
  templateUrl: './form-discard-dialog.component.html',
  styleUrls: ['./form-discard-dialog.component.scss'],
})
export class FormDiscardDialogComponent {
  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialog<Record<string, unknown>, boolean>
  ) {}

  /** PUBLIC METHODS */
  public onClick(exit: boolean): void {
    setTimeout(() => {
      this.context.completeWith(exit);
    });
  }
}
