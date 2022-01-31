import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeepUserGuard } from '@shared/guards';
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
    loadChildren: async () =>
      (await import('@modules/core/components/app-shell/app-shell.module'))
        .AppShellModule,
  },
  {
    path: '403',
    canActivate: [KeepUserGuard],
    pathMatch: 'full',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    canActivate: [KeepUserGuard],
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
