import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { fadeOut } from '@teaching-scheduling-system/core/ui/animations';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  AppShellState,
  selectStatus
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { delayWhen, filter, interval, map, of } from 'rxjs';

@Component({
  selector: 'tss-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeOut],
})
export class LoaderComponent {
  /** PUBLIC PROPERTIES */
  public showLoader$ = this.appShellStore.select(selectStatus).pipe(
    filter((s) => s !== EApiStatus.unknown),
    map((s) => s !== EApiStatus.successful),
    delayWhen((x) => (x ? of(null) : interval(500)))
  );

  /** CONSTRUCTOR */
  constructor(private readonly appShellStore: Store<AppShellState>) {}
}
