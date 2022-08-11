import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { fadeOut } from '@teaching-scheduling-system/core/ui/animations';
import {
  AppShellState,
  selectShowLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { concatMap, delayWhen, interval, of } from 'rxjs';

@Component({
  selector: 'tss-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeOut],
})
export class LoaderComponent {
  // PUBLIC PROPERTIES
  showLoader$ = this.appShellStore
    .select(selectShowLoader)
    .pipe(
      concatMap((x) =>
        of(x).pipe(delayWhen((x) => (x ? of(null) : interval(500))))
      )
    );

  // CONSTRUCTOR
  constructor(private readonly appShellStore: Store<AppShellState>) {}
}
