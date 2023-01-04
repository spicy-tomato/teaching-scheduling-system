import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiMobileCalendarModule } from '@taiga-ui/addon-mobile';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { TouchScreenDirectiveModule } from '@teaching-scheduling-system/core/directives/touch-screen';
import { DateTextPipe } from './date-text/date-text.pipe';
import { InputDateRangeComponent } from './input-date-range.component';

const TAIGA_UI = [
  TuiButtonModule,
  TuiInputDateRangeModule,
  TuiMobileCalendarModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TouchScreenDirectiveModule,
    ...TAIGA_UI,
  ],
  declarations: [InputDateRangeComponent, DateTextPipe],
  exports: [InputDateRangeComponent],
})
export class InputDateRangeModule {}
