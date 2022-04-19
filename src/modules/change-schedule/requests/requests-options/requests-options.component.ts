import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant } from '@shared/constants';
import { ObjectHelper, ObservableHelper } from '@shared/helpers';
import {
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
  RequestDataState,
  SimpleModel,
} from '@shared/models';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';

@Component({
  selector: 'tss-requests-options',
  templateUrl: './requests-options.component.html',
  styleUrls: ['./requests-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsOptionsComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public options$: Observable<ChangeScheduleOptions>;
  public data$: Observable<RequestDataState>;
  public department$: Observable<SimpleModel>;
  public personal: boolean;

  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList, {
    uniqueValue: true,
  }).sort((a, b) => (a.id as number) - (b.id as number));

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    route: ActivatedRoute,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.data$ = store
      .select(fromRequests.selectData)
      .pipe(takeUntil(this.destroy$));
    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));

    this.personal = route.snapshot.data['personal'] as boolean;

    if (!this.personal) {
      this.triggerLoadTeachersList();
    }
  }

  /** PUBLIC METHODS */
  public changeOptions(options: ChangeScheduleOptionsParam): void {
    this.store.dispatch(fromRequests.changeOptions({ options }));
  }

  /** PRIVATE METHODS */
  private triggerLoadTeachersList(): void {
    this.department$
      .pipe(
        tap((department) => {
          this.store.dispatch(
            fromRequests.loadTeachersList({ dep: department.id })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
