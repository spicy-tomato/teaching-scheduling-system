import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: async () => (await import('@modules/login/login.module')).LoginModule,
  },
  {
    path: '',
    loadChildren: async () => (await import('@modules/app-shell/app-shell.module')).AppShellModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
