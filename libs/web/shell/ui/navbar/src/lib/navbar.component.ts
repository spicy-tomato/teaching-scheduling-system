import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { NavbarConstants } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AccessTokenService,
  AuthService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { Observable, takeUntil } from 'rxjs';
import { NAVBAR_OPTIONS, NavbarOptions } from './navbar.token';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class NavbarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items = NavbarConstants.items;
  public user$: Observable<Nullable<Teacher>> | undefined;
  public openMobileNav = false;
  public openDropDown = false;
  public isMobileScreen = true;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly accessTokenService: AccessTokenService,
    private readonly authService: AuthService,
    @Inject(NAVBAR_OPTIONS) public readonly options: NavbarOptions,
    appShellStore: Store<AppShellState>,
    destroy$: TuiDestroyService
  ) {
    this.onResize();
    if (options.showInfo) {
      this.user$ = appShellStore
        .select(selectTeacher)
        .pipe(takeUntil(destroy$));
    }
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

  /** PRIVATE METHODS */
  @HostListener('window:resize')
  private onResize(): void {
    if (window.innerWidth < 1024 && !this.isMobileScreen) {
      this.isMobileScreen = true;
    } else if (window.innerWidth >= 1024 && this.isMobileScreen) {
      this.isMobileScreen = false;
      this.toggleMobileNav(false);
    }
  }

  public toggleMobileNav(open: boolean): void {
    this.openMobileNav = open;
  }
}
