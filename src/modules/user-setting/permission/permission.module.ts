import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionComponent } from './permission.component';
import { PermissionRoutingModule } from './permission.routes';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiHintModule } from '@taiga-ui/core';

const TAIGA_UI = [TuiTableModule, TuiButtonModule, TuiHintModule];

@NgModule({
  imports: [CommonModule, PermissionRoutingModule, ...TAIGA_UI],
  declarations: [PermissionComponent],
})
export class PermissionModule {}
