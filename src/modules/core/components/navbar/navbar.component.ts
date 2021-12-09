import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarConstants } from 'src/shared/constants/navbar.constants';
import { NavbarGroup } from '@models/navbar/navbar-item.model';
import { TokenService } from '@services/core/token.service';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items: NavbarGroup[] = NavbarConstants.items;

  /** CONSTRUCTOR */
  constructor(private router: Router, private tokenService: TokenService) {}

  /** PUBLIC METHODS */
  public onClickDropDownItem(action: string): void {
    if (action === NavbarConstants.keys.LOG_OUT) {
      this.tokenService.clear();
      void this.router.navigate(['/login']);
    }
  }
}
