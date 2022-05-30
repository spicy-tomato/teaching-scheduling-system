import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarConstant } from '@shared/constants';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { Nullable, Teacher } from '@shared/models';
import { Observable } from 'rxjs';
import { fadeIn } from '@shared/animations';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@modules/core/base/base.component';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
})
export class SidebarComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public user$: Observable<Nullable<Teacher>>;
  public readonly items = SidebarConstant.items;

  /** CONSTRUCTOR */
  constructor(appShellStore: Store<fromAppShell.AppShellState>) {
    super();

    this.user$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(takeUntil(this.destroy$));
  }
}
