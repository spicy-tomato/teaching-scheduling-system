import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';

@Component({
  selector: 'tss-change-request-menu',
  templateUrl: './change-request-menu.component.html',
  styleUrls: ['./change-request-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'icon',
      size: 'm',
    }),
  ],
})
export class ChangeRequestMenuComponent {
  /** PUBLIC PROPERTIES */
  public openRightMenu = false;

  /** PUBLIC METHODS */
  public toggleRightMenu(open: boolean): void {
    this.openRightMenu = open;
  }
}
