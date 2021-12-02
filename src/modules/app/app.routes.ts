import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { KeepUserGuard } from 'src/guards/keep-user.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [KeepUserGuard],
    loadChildren: async () =>
      (await import('@modules/core/pages/login/login.module')).LoginModule,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: async () =>
      (await import('@modules/core/components/app-shell/app-shell.module'))
        .AppShellModule,
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    loadChildren: async () =>
      (await import('@modules/core/pages/404/404.module')).Error404Module,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
