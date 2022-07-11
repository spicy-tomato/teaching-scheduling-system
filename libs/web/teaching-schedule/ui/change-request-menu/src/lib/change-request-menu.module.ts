import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { ChangeRequestFilterLeftModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-request-filter-left';
import { ChangeRequestMenuComponent } from './change-request-menu.component';

const TAIGA_UI = [TuiActiveZoneModule, TuiButtonModule, TuiSidebarModule];

@NgModule({
  imports: [CommonModule, ChangeRequestFilterLeftModule, TAIGA_UI],
  declarations: [ChangeRequestMenuComponent],
  exports: [ChangeRequestMenuComponent],
})
export class ChangeRequestMenuModule {}
