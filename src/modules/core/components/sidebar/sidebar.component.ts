import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarConstant } from 'src/shared/constants/sidebar.constants';
import { SidebarItem } from '@models/sidebar/sidebar-item.model';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items: SidebarItem[] = SidebarConstant.items;
}
