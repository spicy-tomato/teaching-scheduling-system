import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { SidebarConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable, takeUntil } from 'rxjs';
import * as fromAppShell from '@teaching-scheduling-system/web/shared/data-access/store';
import { TuiDestroyService } from '@taiga-ui/cdk';

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
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    this.user$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(takeUntil(this.destroy$));
  }
}
