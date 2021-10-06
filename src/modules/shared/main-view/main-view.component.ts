import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/app/base.component';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as fromMainView from './state';

@Component({
  selector: 'tss-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainViewComponent extends BaseComponent {
  breadcrumbs$ = this.store
    .pipe(
      select(fromMainView.selectBreadcrumbs),
      takeUntil(this.destroy$)
    );

  constructor(private store: Store<fromMainView.MainViewState>) {
    super();
  }
}
