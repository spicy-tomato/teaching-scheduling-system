import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarConstant } from '@shared/constants';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { Nullable, Teacher } from '@shared/models';
import { Observable } from 'rxjs';
import { fadeIn, fadeOut } from '@shared/animations';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn, fadeOut],
})
export class SidebarComponent {
  /** PUBLIC PROPERTIES */
  public user$: Observable<Nullable<Teacher>>;
  public readonly items = SidebarConstant.items;

  /** CONSTRUCTOR */
  constructor(appShellStore: Store<fromAppShell.AppShellState>) {
    this.user$ = appShellStore.select(fromAppShell.selectTeacher);
  }
}
