import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { ComponentErrorModule } from '@teaching-scheduling-system/web/error/ui/component-error';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NotFoundComponent }]),
    ComponentErrorModule,
  ],
  declarations: [NotFoundComponent],
})
export class NotFoundModule {}
