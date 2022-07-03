import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { SidebarConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
  animations: [fadeIn],
})
export class SidebarComponent {
  /** PUBLIC PROPERTIES */
  public user$: Observable<Nullable<Teacher>>;
  public readonly items = SidebarConstant.items;

  /** CONSTRUCTOR */
  constructor(
    appShellStore: Store<AppShellState>,
    destroy$: TuiDestroyService
  ) {
    this.user$ = appShellStore.select(selectTeacher).pipe(takeUntil(destroy$));
  }
}
