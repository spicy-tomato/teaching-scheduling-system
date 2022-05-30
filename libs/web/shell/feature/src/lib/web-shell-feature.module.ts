import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

export const webShellFeatureRoutes: Routes = [
  {
    path: 'login',
    // canActivate: [KeepUserGuard],
    loadChildren: async () =>
      (await import('@teaching-scheduling-system/web/login/feature'))
        .LoginModule,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(webShellFeatureRoutes)],
  exports: [RouterModule],
})
export class WebShellFeatureModule {}
