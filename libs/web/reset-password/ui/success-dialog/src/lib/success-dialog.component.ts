import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessDialogComponent {
  // CONSTRUCTOR
  constructor(
    private readonly router: Router,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext
  ) {}

  // PUBLIC METHODS
  returnLogin(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
      void this.router.navigate(['/login']);
    });
  }
}
