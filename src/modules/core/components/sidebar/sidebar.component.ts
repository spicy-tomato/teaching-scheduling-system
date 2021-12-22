import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarConstant } from '@constants/components/sidebar.constants';
import { SidebarItem } from '@models/sidebar/sidebar-item.model';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public permissions$!: Observable<number[] | undefined>;
  public readonly items: SidebarItem[] = SidebarConstant.items;

  /** CONSTRUCTOR */
  constructor(appShellStore: Store<fromAppShell.AppShellState>) {
    super();

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));
  }
}
