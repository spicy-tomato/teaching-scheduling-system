import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarConstants } from '@shared/constants';
import { AccessTokenService } from '@services/core/access-token.service';
import { Store } from '@ngrx/store';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Observable } from 'rxjs';
import { BaseComponent } from '@modules/core/base/base.component';
import { AuthService } from '@services/core/auth.service';
import { Teacher } from '@shared/models';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public readonly items = NavbarConstants.items;
  public user$: Observable<Teacher>;
  public openDropDown = false;

  /** CONSTRUCTOR */
  constructor(
    appShellStore: Store<fromAppShell.AppShellState>,
    private readonly router: Router,
    private readonly accessTokenService: AccessTokenService,
    private readonly authService: AuthService
  ) {
    super();

    this.user$ = appShellStore.pipe(fromAppShell.selectNotNullTeacher);
  }

  /** PUBLIC METHODS */
  public onClickDropDownItem(action: string): void {
    this.openDropDown = false;
    if (action === NavbarConstants.keys.LOG_OUT) {
      this.authService.logOut().subscribe();
      this.accessTokenService.clear();
      void this.router.navigate(['/login']);
    }
  }
}
