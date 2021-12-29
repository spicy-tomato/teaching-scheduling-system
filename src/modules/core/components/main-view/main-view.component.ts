import { ChangeDetectionStrategy, Component } from '@angular/core';
import { routerFade } from 'src/shared/animations/route-fade.animation';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromMainView from './state';
import { BreadcrumbItem } from 'src/shared/models';

@Component({
  selector: 'tss-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  animations: [routerFade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainViewComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public breadcrumbs$: Observable<BreadcrumbItem[]>;

  /** CONSTRUCTOR */
  constructor(store: Store<fromMainView.MainViewState>) {
    super();
    this.breadcrumbs$ = store
      .select(fromMainView.selectBreadcrumbs)
      .pipe(takeUntil(this.destroy$));
  }
}
