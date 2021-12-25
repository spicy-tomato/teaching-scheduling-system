import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found.routes';
import { SharedPagesModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, NotFoundRoutingModule, SharedPagesModule],
  declarations: [NotFoundComponent],
})
export class Error404Module {}
