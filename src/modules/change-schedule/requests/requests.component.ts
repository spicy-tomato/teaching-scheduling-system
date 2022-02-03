import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import * as fromRequests from './state';

@Component({
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent extends BaseComponent implements OnInit {
  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    route: ActivatedRoute
  ) {
    super();

    const personal = route.snapshot.data['personal'] as boolean;
    store.dispatch(fromRequests.reset({ personal }));
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
