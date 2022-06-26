import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarNamePipe } from './navbar-name.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [NavbarNamePipe],
  exports: [NavbarNamePipe],
})
export class NavbarNamePipeModule {}
