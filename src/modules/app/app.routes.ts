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
    canLoad: [KeepUserGuard],
    loadChildren: async () =>
      (await import('@modules/core/pages/login/login.module')).LoginModule,
  },
  {
    path: '',
    resolve: { userInfo: UserInfoResolve },
    loadChildren: async () =>
      (await import('@modules/core/components/app-shell/app-shell.module'))
        .AppShellModule,
  },
  {
    path: '403',
    pathMatch: 'full',
    resolve: { userInfo: UserInfoResolve },
    component: ForbiddenComponent,
  },
  {
    path: '**',
    resolve: { userInfo: UserInfoResolve },
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
