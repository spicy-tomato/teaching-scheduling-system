import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './login.routes';

@NgModule({
  imports: [CommonModule, NotFoundRoutingModule],
  declarations: [NotFoundComponent],
})
export class Error404Module {}
