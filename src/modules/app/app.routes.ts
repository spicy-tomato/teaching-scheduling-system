import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeepUserGuard } from '@shared/guards';
import { UserInfoResolve } from '@resolves/user-info.resolve';
import {
  ForbiddenComponent,
  NotFoundComponent,
} from '@modules/core/pages/pages.module';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [KeepUserGuard],
    loadChildren: async () =>
      (await import('@modules/core/pages/login/login.module')).LoginModule,
  },
  {
    path: '',
    canActivate: [KeepUserGuard],
    resolve: { userInfo: UserInfoResolve },
    loadChildren: async () =>
      (await import('@modules/core/components/app-shell/app-shell.module'))
        .AppShellModule,
  },
  {
    path: '403',
    canActivate: [KeepUserGuard],
    pathMatch: 'full',
    resolve: { userInfo: UserInfoResolve },
    component: ForbiddenComponent,
  },
  {
    path: '**',
    canActivate: [KeepUserGuard],
    resolve: { userInfo: UserInfoResolve },
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
