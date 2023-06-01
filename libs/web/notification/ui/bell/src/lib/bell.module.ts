import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiHostedDropdownModule } from '@taiga-ui/core';
import { TuiBadgedContentModule } from '@taiga-ui/kit';
import { NotificationListModule } from '@teaching-scheduling-system/web/notification/ui/notification-list';
import { BellComponent } from './bell.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiActiveZoneModule,
  TuiBadgedContentModule,
  TuiButtonModule,
  TuiHostedDropdownModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NotificationListModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [BellComponent],
  exports: [BellComponent],
})
export class BellModule {}
