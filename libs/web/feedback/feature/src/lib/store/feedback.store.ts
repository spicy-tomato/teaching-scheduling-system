import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  Feedback,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs';

type FeedbackState = GenericState<void>;

@Injectable()
export class FeedbackStore extends ComponentStore<FeedbackState> {
  /** PUBLIC PROPERTIES */
  readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  readonly submit = this.effect<{ data: Feedback }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap((params) =>
        this.userService.sendFeedback(params.data).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: 'successful',
                error: '',
              }),
            (error) =>
              this.patchState({
                status: 'systemError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  /** CONSTRUCTOR */
  constructor(private readonly userService: UserService) {
    super(<FeedbackState>{});
  }
}
