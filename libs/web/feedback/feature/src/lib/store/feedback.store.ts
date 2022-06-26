import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  Feedback,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs/operators';

type FeedbackState = GenericState<void>;

@Injectable()
export class FeedbackStore extends ComponentStore<FeedbackState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly submit = this.effect<{ data: Feedback }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
      switchMap((params) =>
        this.userService.sendFeedback(params.data).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: EApiStatus.successful,
                error: '',
              }),
            (error) =>
              this.patchState({
                status: EApiStatus.systemError,
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
