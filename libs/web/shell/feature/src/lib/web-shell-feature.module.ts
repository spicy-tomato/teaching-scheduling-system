import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TUI_SANITIZER } from '@taiga-ui/cdk';
import { tuiHintOptionsProvider } from '@taiga-ui/core';
import { TUI_LANGUAGE, TUI_VIETNAMESE_LANGUAGE } from '@taiga-ui/i18n';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import {
  PermissionConstant,
  RoleConstant,
} from '@teaching-scheduling-system/core/data-access/constants';
import {
  beforeTodayFactory,
  maxLengthFactory,
  notContainValueFactory,
  requiredFactory,
} from '@teaching-scheduling-system/core/utils/factories';
import { ContentTypeInterceptor } from '@teaching-scheduling-system/core/utils/interceptors';
import { TokenService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  KeepUserGuard,
  MaintenanceGuard,
  PermissionGuard,
} from '@teaching-scheduling-system/web/shared/utils/guards';
import { AuthInterceptor } from '@teaching-scheduling-system/web/shared/utils/interceptors';
import {
  LayoutComponent,
  LayoutModule,
} from '@teaching-scheduling-system/web/shell/ui/layout';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { of } from 'rxjs';
import { extModules } from './build-specifics';

const NGRX = [
  StoreModule.forRoot({ router: routerReducer }, {}),
  EffectsModule.forRoot([]),
  StoreRouterConnectingModule.forRoot(),
];

export const webShellFeatureRoutes: Routes = [
  {
    path: 'login',
    canActivate: [KeepUserGuard],
    data: {
      title: 'Đăng nhập',
    },
    loadChildren: async () =>
      (await import('@teaching-scheduling-system/web/login/feature'))
        .LoginModule,
  },
  {
    path: '',
    canActivate: [KeepUserGuard],
    data: {
      breadcrumb: 'Trang chủ',
    },
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        // loadChildren: async () => (await import('@modules/home/home.module')).HomeModule
        redirectTo: 'calendar',
      },
      {
        path: 'admin',
        canActivate: [PermissionGuard],
        data: {
          roles: [RoleConstant.ADMIN],
          breadcrumb: 'Admin',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/admin/feature/shell'))
            .ShellModule,
      },
      {
        path: 'calendar',
        canActivate: [MaintenanceGuard],
        data: {
          breadcrumb: 'Lịch biểu',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/calendar/feature'))
            .CalendarModule,
      },
      {
        path: 'schedule',
        canActivate: [MaintenanceGuard],
        data: {
          breadcrumb: 'Lịch giảng dạy',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/teaching-schedule/feature/shell'
            )
          ).TeachingScheduleShellModule,
      },
      {
        path: 'exam',
        canActivate: [MaintenanceGuard, PermissionGuard],
        data: {
          permissions: [PermissionConstant.ASSIGN_SCHEDULE],
          breadcrumb: 'Lịch thi',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/exam/feature/shell'))
            .ShellModule,
      },
      {
        path: 'statistic',
        canActivate: [MaintenanceGuard, PermissionGuard],
        data: {
          breadcrumb: 'Thống kê',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/statistic/feature/shell'
            )
          ).ShellModule,
      },
      {
        path: 'settings',
        canActivate: [MaintenanceGuard],
        data: {
          breadcrumb: 'Cài đặt',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/settings/feature/shell'
            )
          ).ShellModule,
      },
      {
        path: 'feedback',
        canActivate: [MaintenanceGuard],
        data: {
          breadcrumb: 'Đóng góp ý kiến',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/feedback/feature'))
            .FeedbackModule,
      },
      {
        path: 'user-info',
        canActivate: [MaintenanceGuard],
        data: {
          breadcrumb: 'Thông tin cá nhân',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/user-info/feature'))
            .UserInfoModule,
      },
      {
        path: 'notifications',
        data: {
          breadcrumb: 'Thông báo',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/notification/feature'))
            .FeatureModule,
      },
    ],
  },
  {
    path: 'maintenance',
    data: {
      title: '🛠️ Ứng dụng đang được bảo trì 🛠️',
    },
    canActivate: [MaintenanceGuard, KeepUserGuard],
    loadChildren: async () =>
      (
        await import(
          '@teaching-scheduling-system/web/error/feature/maintenance'
        )
      ).MaintenanceModule,
  },
  {
    path: 'reset-password',
    loadChildren: async () =>
      (
        await import(
          '@teaching-scheduling-system/web/reset-password/feature/shell'
        )
      ).ShellModule,
  },
  {
    path: '403',
    data: {
      title: 'Không có quyền truy cập',
    },
    canActivate: [MaintenanceGuard, KeepUserGuard],
    loadChildren: async () =>
      (await import('@teaching-scheduling-system/web/error/feature/forbidden'))
        .ForbiddenModule,
  },
  {
    path: '**',
    data: {
      title: 'Không tìm thấy trang',
    },
    canActivate: [MaintenanceGuard, KeepUserGuard],
    loadChildren: async () =>
      (await import('@teaching-scheduling-system/web/error/feature/not-found'))
        .NotFoundModule,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(webShellFeatureRoutes),
    LayoutModule,
    ...NGRX,
    ...extModules,
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContentTypeInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: TokenService.DATE_PIPE_TOKEN,
      useClass: DatePipe,
    },
    {
      provide: LOCALE_ID,
      useValue: 'vi',
    },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_VIETNAMESE_LANGUAGE),
    },
    {
      provide: TUI_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        maxlength: maxLengthFactory,
        required: requiredFactory,
        notContainValue: notContainValueFactory,
        beforeToday: beforeTodayFactory,
      },
    },
    tuiHintOptionsProvider({
      tuiHintShowDelay: 300,
      tuiHintHideDelay: 100,
      direction: 'bottom-middle',
    }),
    NavbarService,
  ],
})
export class WebShellFeatureModule {}
