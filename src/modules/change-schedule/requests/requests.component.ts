import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { TUI_BUTTON_OPTIONS, TuiAppearance } from '@taiga-ui/core';
import * as fromRequests from './state';

@Component({
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent extends BaseComponent implements OnInit {
  /** CONSTRUCTOR */
  constructor(private readonly store: Store<fromRequests.RequestsState>) {
    super();

    store.dispatch(fromRequests.reset());
  }

  /** LIFE CYCLES */
  public ngOnInit(): void {
    this.store.dispatch(
      fromRequests.load({
        query: {
          status: 'all',
          page: 1,
        },
      })
    );
  }
}
