import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import * as fromRequests from './state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ObservableHelper } from '@shared/helpers';
import { Teacher } from '@shared/models';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent extends BaseComponent {
  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    private readonly appShellStore: Store<fromAppShell.AppShellState>,
    route: ActivatedRoute
  ) {
    super();

    const personal = route.snapshot.data['personal'] as boolean;
    store.dispatch(fromRequests.reset({ personal }));

    this.teacher$ = this.appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(ObservableHelper.filterNullish());

    if (personal) {
      this.handleSelectTeacher();
    } else {
      this.store.dispatch(
        fromRequests.filter({
          query: {
            status: [],
            page: 1,
            pagination: 20,
          },
        })
      );
    }
  }

  private handleSelectTeacher(): void {
    this.teacher$
      .pipe(
        tap((teacher) => {
          this.store.dispatch(
            fromRequests.changeOptions({
              options: {
                teacher: teacher,
              },
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
