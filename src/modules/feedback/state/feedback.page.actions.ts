import { SendFeedback } from '@models/user/send-feedback.model';
import { createAction, props } from '@ngrx/store';

export const submit = createAction(
  '[Feedback Page] Submit',
  props<{ form: SendFeedback }>()
);
