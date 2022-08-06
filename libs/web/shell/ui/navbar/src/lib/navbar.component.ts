import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
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
import { NavbarService } from './navbar.service';
import { NavbarOptions, NAVBAR_OPTIONS } from './navbar.token';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'icon',
      size: 'm',
    }),
    TuiDestroyService,
  ],
})
export class NavbarComponent {
  /** PUBLIC PROPERTIES */
  readonly items = NavbarConstants.items;
  readonly rightMenu$: Observable<Nullable<TemplateRef<never>>>;

  openMobileNav = false;
  openDropDown = false;
  isMobileScreen = true;
  user$: Observable<Nullable<Teacher>> | undefined;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly accessTokenService: AccessTokenService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(NAVBAR_OPTIONS) public readonly options: NavbarOptions,
    appShellStore: Store<AppShellState>,
    navbarService: NavbarService,
    destroy$: TuiDestroyService
  ) {
    this.onResize();
    if (options.showInfo) {
      this.user$ = appShellStore
        .select(selectTeacher)
        .pipe(takeUntil(destroy$));
    }
    this.rightMenu$ = navbarService.rightMenu$.pipe(takeUntil(destroy$));
  }

  /** PUBLIC METHODS */
  onClickDropDownItem(action: string): void {
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

  toggleMobileNav(open: boolean, needMarkForCheck = false): void {
    this.openMobileNav = open;
    if (needMarkForCheck) {
      this.cdr.markForCheck();
    }
  }
}
