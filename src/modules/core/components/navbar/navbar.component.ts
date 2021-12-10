import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarConstants } from 'src/shared/constants/navbar.constants';
import { NavbarGroup } from '@models/navbar/navbar-item.model';
import { TokenService } from '@services/core/token.service';
import { Teacher } from '@models/core/teacher.model';
import { Store } from '@ngrx/store';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items: NavbarGroup[] = NavbarConstants.items;
  public user$!: Observable<Teacher | undefined>;
  public openDropDown = false;

  /** CONSTRUCTOR */
  constructor(
    appShellStore: Store<fromAppShell.AppShellState>,
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {
    this.user$ = appShellStore.select(fromAppShell.selectTeacher);
  }

  /** PUBLIC METHODS */
  public onClickDropDownItem(action: string): void {
    this.openDropDown = false;
    if (action === NavbarConstants.keys.LOG_OUT) {
      this.tokenService.clear();
      void this.router.navigate(['/login']);
    }
  }
}
