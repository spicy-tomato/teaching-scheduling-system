import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarConstant } from '@shared/constants';
import { SidebarItem } from 'src/shared/models';

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
