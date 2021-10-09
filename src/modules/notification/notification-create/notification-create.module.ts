import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TuiDataListModule, TuiLabelModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiFieldErrorModule, TuiInputDateRangeModule, TuiInputModule, TuiSelectModule, TuiTabsModule } from '@taiga-ui/kit';
import { defaultEditorExtensions, TuiEditorModule, TUI_EDITOR_EXTENSIONS } from '@taiga-ui/addon-editor';

import { NotificationCreateRoutingModule } from './notification-create.routes';
import { NotificationCreateCommonFormComponent } from './common/notification-create-common-form/notification-create-common-form.component';
import { NotificationCreateManagingClassComponent } from './components/notification-create-managing-class/notification-create-managing-class.component';
import { NotificationCreateModuleClassComponent } from './components/notification-create-module-class/notification-create-module-class.component';
import { NotificationCreateShellComponent } from './shell/notification-create-shell.component';
import { NotificationCreateAsideComponent } from './common/notification-create-aside/notification-create-aside.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTabsModule,
    TuiInputModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiInputDateRangeModule,
    TuiEditorModule,
    TuiTextfieldControllerModule,
    TuiFieldErrorModule,
    TuiLabelModule,
  ],
  declarations: [
    NotificationCreateManagingClassComponent,
    NotificationCreateModuleClassComponent,
    NotificationCreateCommonFormComponent,
    NotificationCreateShellComponent,
    NotificationCreateAsideComponent,
  ],
  providers: [
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: defaultEditorExtensions
    },
  ]
})
export class NotificationCreateModule { }
