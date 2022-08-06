import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { routerFade } from '@teaching-scheduling-system/core/ui/animations';
import { BreadcrumbItem } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectBreadcrumbs,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
  animations: [routerFade],
})
export class MainViewComponent {
  /** PUBLIC METHODS */
  readonly breadcrumbs$: Observable<BreadcrumbItem[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.breadcrumbs$ = appShellStore
      .select(selectBreadcrumbs)
      .pipe(takeUntil(this.destroy$));
  }
}
