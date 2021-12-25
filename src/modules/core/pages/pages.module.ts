import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPagesModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { ForbiddenComponent } from './403/forbidden.component';
import { NotFoundComponent } from './404/not-found.component';
export { ForbiddenComponent } from './403/forbidden.component';
export { NotFoundComponent } from './404/not-found.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedPagesModule],
  declarations: [ForbiddenComponent, NotFoundComponent],
})
export class PagesModule {}
