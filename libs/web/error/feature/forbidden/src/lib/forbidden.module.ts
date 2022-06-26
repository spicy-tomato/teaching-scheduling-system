import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ForbiddenComponent } from './forbidden.component';
import { ComponentErrorModule } from '@teaching-scheduling-system/web/error/ui/component-error';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ForbiddenComponent }]),
    ComponentErrorModule,
  ],
  declarations: [ForbiddenComponent],
})
export class ForbiddenModule {}
