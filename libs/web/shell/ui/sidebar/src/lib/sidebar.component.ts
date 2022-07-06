import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { SidebarConstant } from '@teaching-scheduling-system/core/data-access/constants';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SidebarComponent {
  /** PUBLIC PROPERTIES */
  public readonly items = SidebarConstant.items;
}
