import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveComponentModule } from '@ngrx/component';

import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiInputDateRangeModule,
  TuiInputModule,
  TuiMultiSelectModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { TuiEditorModule } from '@taiga-ui/addon-editor';

import * as fromNotificationCreate from './state';
import { NotificationCreateRoutingModule } from './notification-create.routes';
import { NotificationCreateCommonFormComponent } from './common/notification-create-common-form/notification-create-common-form.component';
import { NotificationCreateManagingClassComponent } from './components/notification-create-managing-class/notification-create-managing-class.component';
import { NotificationCreateModuleClassComponent } from './components/notification-create-module-class/notification-create-module-class.component';
import { NotificationCreateShellComponent } from './shell/notification-create-shell.component';
import { NotificationCreateAsideComponent } from './common/notification-create-aside/notification-create-aside.component';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromNotificationCreate.notificationCreateFeatureKey,
    fromNotificationCreate.notificationCreateReducer
  ),
  EffectsModule.forFeature([fromNotificationCreate.NotificationCreateEffects]),
];
const TAIGA_UI = [
  TuiTabsModule,
  TuiInputModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiInputDateRangeModule,
  TuiEditorModule,
  TuiTextfieldControllerModule,
  TuiFieldErrorModule,
  TuiButtonModule,
  TuiMultiSelectModule,
  TuiDataListWrapperModule,
  TuiLetModule,
  TuiCheckboxLabeledModule,
  TuiLoaderModule,
];
const COMPONENTS = [
  NotificationCreateManagingClassComponent,
  NotificationCreateModuleClassComponent,
  NotificationCreateCommonFormComponent,
  NotificationCreateShellComponent,
  NotificationCreateAsideComponent,
];

@NgModule({
  imports: [
    CommonModule,
    NotificationCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [...COMPONENTS],
})
export class NotificationCreateModule {}
