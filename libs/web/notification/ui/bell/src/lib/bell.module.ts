import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiSvgModule
} from '@taiga-ui/core';
import {
  TuiBadgedContentModule,
  TuiLineClampModule,
  TuiMarkerIconModule,
  TuiTabsModule
} from '@taiga-ui/kit';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { RelativeTimePipeModule } from '@teaching-scheduling-system/core/pipes/relative-time';
import { NotificationListModule } from '@teaching-scheduling-system/web/notification/ui/notification-list';
import { BellComponent } from './bell.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiActiveZoneModule,
  TuiBadgedContentModule,
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiHintModule,
  TuiLineClampModule,
  TuiMarkerIconModule,
  TuiSvgModule,
  TuiTabsModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    VarDirectiveModule,
    RelativeTimePipeModule,
    NotificationListModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [BellComponent],
  exports: [BellComponent],
})
export class BellModule {}
