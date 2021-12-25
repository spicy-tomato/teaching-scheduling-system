import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenComponent } from './forbidden.component';
import { SharedPagesModule } from '../shared/shared.module';
import { ForbiddenRoutingModule } from './forbidden.routes';

@NgModule({
  imports: [CommonModule, ForbiddenRoutingModule, SharedPagesModule],
  declarations: [ForbiddenComponent],
})
export class Error403Module {}
