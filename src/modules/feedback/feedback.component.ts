import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorConstant } from '@constants/components/editor.constant';
import {
  FeedbackConstant,
  FeedbackItem,
} from '@constants/feedback-topic.constant';
import { SendFeedback } from '@models/user/send-feedback.model';
import { Store } from '@ngrx/store';
import { TuiEditorTool } from '@taiga-ui/addon-editor';
import { Observable } from 'rxjs';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import * as fromFeedback from './state';

@Component({
  selector: 'tss-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public status$: Observable<EApiStatus>;
  public readonly topics = FeedbackConstant.items;
  public readonly tools = EditorConstant.tools;

  /** CONSTRUCTOR */
  constructor(
    store: Store<fromFeedback.FeedbackState>,
    private readonly fb: FormBuilder
  ) {
    this.status$ = store.select(fromFeedback.selectStatus);
    this.initForm();
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    if (this.form.valid) {
      const form: SendFeedback = {
        title: this.form.get('title')?.value as string,
        reportBug: this.form.get('reportBug')?.value as boolean,
        feedback_type: (this.form.get('tags')?.value as FeedbackItem[])
          .map((x) => x.key)
          .join(','),
        content: this.form.get('content')?.value as string,
      };
      console.log(form);
    }
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      title: [''],
      reportBug: [false],
      tags: [[]],
      content: ['', Validators.required],
    });
  }
}
