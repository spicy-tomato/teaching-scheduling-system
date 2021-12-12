import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'tss-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessDialogComponent {
  /** PUBLIC PROPERTIES */
  public nameTitle$!: Observable<string>;

  /** CONSTRUCTOR */
  constructor(
    appShellStore: Store<fromAppShell.AppShellState>,
    private readonly router: Router,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext
  ) {
    this.nameTitle$ = appShellStore.select(fromAppShell.selectNameTitle);
  }

  /** PUBLIC METHODS */
  public returnHome(): void {
    this.context.$implicit.complete();
    void this.router.navigate(['']);
  }

  public seeFeedback(): void {
    this.context.$implicit.complete();
  }
}
