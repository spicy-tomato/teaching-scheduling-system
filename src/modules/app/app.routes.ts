import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: async () =>
      (await import('@modules/core/pages/login/login.module')).LoginModule,
  },
  {
    path: '',
    loadChildren: async () =>
      (await import('@modules/core/components/app-shell/app-shell.module'))
        .AppShellModule,
  },
  {
    path: '**',
    loadChildren: async () =>
      (await import('@modules/core/pages/404/404.module')).Error404Module,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
