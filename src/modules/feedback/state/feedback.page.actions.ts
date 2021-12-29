import { createAction, props } from '@ngrx/store';
import { SendFeedback } from 'src/shared/models';

export const submit = createAction(
  '[Feedback Page] Submit',
  props<{ form: SendFeedback }>()
);

export const reset = createAction('[Feedback Page] Reset');
