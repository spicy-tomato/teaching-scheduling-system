import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeepUserGuard } from 'src/guards/keep-user.guard';
import { UserInfoResolve } from 'src/shared/resolves/user-info.resolve';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [KeepUserGuard],
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
    path: '**',
    resolve: { userInfo: UserInfoResolve },
    loadChildren: async () =>
      (await import('@modules/core/pages/404/404.module')).Error404Module,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
