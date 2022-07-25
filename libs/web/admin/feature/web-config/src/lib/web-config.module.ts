import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebConfigComponent } from './web-config.component';
import { FormsModule } from '@angular/forms';
import { TuiToggleModule } from '@taiga-ui/kit';

const TAIGA_UI = [TuiToggleModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: WebConfigComponent }]),
    FormsModule,
    ...TAIGA_UI,
  ],
  declarations: [WebConfigComponent],
})
export class WebConfigModule {}
