import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TuiTabsModule } from '@taiga-ui/kit';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { PermissionGuard } from '@teaching-scheduling-system/web/shared/utils/guards';
import {
  TeachingScheduleRequestEffects,
  teachingScheduleRequestFeatureKey,
  teachingScheduleRequestReducer,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { ChangeComponent } from './change.component';

const NGRX = [
  StoreModule.forFeature(
    teachingScheduleRequestFeatureKey,
    teachingScheduleRequestReducer
  ),
  EffectsModule.forFeature([TeachingScheduleRequestEffects]),
];
const TAIGA_UI = [TuiTabsModule, TuiTabsModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChangeComponent,
        children: [
          {
            path: 'department',
            canActivate: [PermissionGuard],
            data: {
              permissions: [
                PermissionConstant.ACCEPT_CHANGE_TEACHING_SCHEDULE,
                PermissionConstant.MANAGE_ROOM,
              ],
              personal: false,
              breadcrumb: 'Bộ môn',
            },
            loadChildren: async () =>
              (
                await import(
                  '@teaching-scheduling-system/web/teaching-schedule/ui/change-request'
                )
              ).ChangeRequestModule,
          },
          {
            path: '',
            pathMatch: 'full',
            canActivate: [PermissionGuard],
            data: {
              permissions: [
                PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
              ],
              redirect: 'change-schedule/requests',
              personal: true,
              breadcrumb: 'Cá nhân',
            },
            loadChildren: async () =>
              (
                await import(
                  '@teaching-scheduling-system/web/teaching-schedule/ui/change-request'
                )
              ).ChangeRequestModule,
          },
        ],
      },
    ]),
    PermissionDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeComponent],
})
export class ChangeModule {}
