import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInformationComponent } from './user-information.component';
import { UserInformationRoutingModule } from './user-information.routes';
import { TuiButtonModule, TuiGroupModule, TuiHintModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserInformationEditFieldComponent } from './user-information-edit-field/user-information-edit-field.component';

const TAIGA_UI = [
  TuiIslandModule,
  TuiInputModule,
  TuiButtonModule,
  TuiGroupModule,
  TuiHintModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserInformationRoutingModule,
    ...TAIGA_UI,
  ],
  declarations: [UserInformationComponent, UserInformationEditFieldComponent],
})
export class UserInformationModule {}
