import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import * as fromAppShell from './state';

@Component({
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent extends BaseComponent implements OnInit {
  /** CONSTRUCTOR */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<fromAppShell.AppShellState>
  ) {
    super();
    this.store.dispatch(fromAppShell.reset());
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.route.data
      .pipe(
        tap((data) => {
          if (!data['skipAutoLogin']) {
            this.store.dispatch(fromAppShell.tryAutoLogin());
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
