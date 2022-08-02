import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TuiBooleanHandler } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import {
  EditorConstant,
  FeedbackConstant,
  FeedbackItem,
} from '@teaching-scheduling-system/core/data-access/constants';
import { SuccessDialogComponent } from '@teaching-scheduling-system/web/feedback/ui/success-dialog';
import { Feedback } from '@teaching-scheduling-system/web/shared/data-access/models';
import { SuccessDialogHeaderComponent } from '@teaching-scheduling-system/web/shared/ui/components/success-dialog-header';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, tap } from 'rxjs';
import { FeedbackStore } from './store';

@Component({
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly topics = FeedbackConstant.items;
  public readonly tools = EditorConstant.tools;
  public readonly status$ = this.store.status$;

  /** PRIVATE PROPERTIES */
  private successDialog$!: Observable<void>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: FeedbackStore,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {
    this.initDialog();
    this.handleSubmit();
    this.initForm();
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    if (this.form.valid) {
      const title = this.form.get('title')?.value as string;
      const form: Feedback = {
        data: {
          content: this.form.get('content')?.value as string,
          title: title ? title : '(Không có tiêu đề)',
        },
        is_bug: this.form.get('reportBug')?.value as number,
        type: (this.form.get('tags')?.value as FeedbackItem[])
          .map((x) => x.key)
          .join(','),
      };
      this.store.submit({ data: form });
    }
  }

  public readonly disabledItemHandler: TuiBooleanHandler<FeedbackItem> = () =>
    this.form.disabled;

  /** PRIVATE METHODS */
  private initDialog(): void {
    this.successDialog$ = this.dialogService.open(
      new PolymorpheusComponent(SuccessDialogComponent, this.injector),
      {
        header: new PolymorpheusComponent(
          SuccessDialogHeaderComponent,
          this.injector
        ),
      }
    );
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: [''],
      reportBug: [0],
      tags: [[]],
      content: ['', [Validators.required, Validators.maxLength(5000)]],
    });
  }

  private handleSubmit(): void {
    this.status$
      .pipe(
        tap((status) => {
          if (status === 'successful') {
            this.openSuccessDialog();
            this.form.disable();
          }
        })
      )
      .subscribe();
  }

  private openSuccessDialog(): void {
    this.successDialog$.subscribe();
  }
}
