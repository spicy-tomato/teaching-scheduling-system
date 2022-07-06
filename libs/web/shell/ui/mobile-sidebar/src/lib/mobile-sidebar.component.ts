import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AccessTokenService,
  AuthService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import { MobileSidebarConstant } from './mobile-sidebar.constant';

@Component({
  selector: 'tss-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSidebarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items = MobileSidebarConstant.items;

  /** OUTPUT */
  @Output() public readonly clickItem = new EventEmitter<void>();

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly accessTokenService: AccessTokenService,
    private readonly authService: AuthService
  ) {}

  /** PUBLIC METHODS */
  public onLogout(): void {
    this.authService.logOut().subscribe();
    this.accessTokenService.clear();
    void this.router.navigate(['/login']);
    this.clickItem.emit();
  }
}
