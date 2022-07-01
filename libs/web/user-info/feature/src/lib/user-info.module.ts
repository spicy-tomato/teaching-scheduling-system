import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { ConfirmInputModule } from '@teaching-scheduling-system/web/shared/ui/components/confirm-input';
import { UserInfoComponent } from './user-info.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiIslandModule, TuiInputModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UserInfoComponent }]),
    ReactiveFormsModule,
    ConfirmInputModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [UserInfoComponent],
})
export class UserInfoModule {}
