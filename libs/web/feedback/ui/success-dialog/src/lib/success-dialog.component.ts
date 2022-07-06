import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import {
  AppShellState,
  selectNameTitle,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable, takeUntil } from 'rxjs';

@Component({
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SuccessDialogComponent {
  /** PUBLIC PROPERTIES */
  public nameTitle$!: Observable<string>;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.nameTitle$ = appShellStore
      .select(selectNameTitle)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  public returnHome(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
      void this.router.navigate(['']);
    });
  }

  public seeFeedback(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }
}
