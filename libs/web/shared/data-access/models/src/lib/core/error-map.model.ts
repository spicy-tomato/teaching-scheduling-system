import { ValidationErrors } from '@angular/forms';

export interface ErrorMapModel {
  [key: string]: ValidationErrors;
}
