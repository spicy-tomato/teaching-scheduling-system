import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarConstants } from '@constants/navbar.constants';
import { NavbarItem } from '@models/navbar/navbar-item.model';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public readonly items: NavbarItem[] = NavbarConstants.items;
}
