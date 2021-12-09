import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarConstants } from 'src/shared/constants/navbar.constants';
import { NavbarGroup } from '@models/navbar/navbar-item.model';
import { TokenService } from '@services/core/token.service';
import { UserInfoService } from '@services/core/user-info.service';
import { Teacher } from '@models/core/teacher.model';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items: NavbarGroup[] = NavbarConstants.items;
  public user?: Teacher;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService,
    private readonly userInfoService: UserInfoService
  ) {
    this.user = userInfoService.get();
  }

  /** PUBLIC METHODS */
  public onClickDropDownItem(action: string): void {
    if (action === NavbarConstants.keys.LOG_OUT) {
      this.tokenService.clear();
      this.userInfoService.clear();
      void this.router.navigate(['/login']);
    }
  }
}
