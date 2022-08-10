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
  TuiSvgModule,
} from '@taiga-ui/core';
import {
  TuiLineClampModule,
  TuiMarkerIconModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { RelativeTimePipeModule } from '@teaching-scheduling-system/core/pipes/relative-time';
import { NotificationListComponent } from './notification-list.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiActiveZoneModule,
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
    RelativeTimePipeModule,
    VarDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [NotificationListComponent],
  exports: [NotificationListComponent],
})
export class NotificationListModule {}
