import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppEnv,
  APP_ENV,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  AppShellState,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import Echo from 'laravel-echo';
import { BehaviorSubject, tap } from 'rxjs';
import { EchoMessage, messageEvent, MessageEvent } from '../models/echo.model';

@Injectable()
export class EchoService {
  // PUBLIC PROPERTIES
  readonly echo: Echo;
  readonly message$ = new BehaviorSubject<{
    event: MessageEvent;
    content: EchoMessage;
  }>(
    {} as {
      event: MessageEvent;
      content: EchoMessage;
    }
  );

  // PRIVATE PROPERTIES
  private channels: string[] = [];

  // CONSTRUCTOR
  constructor(
    @Inject(APP_ENV) env: AppEnv,
    private readonly appShellStore: Store<AppShellState>
  ) {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: env.pusher.key,
      cluster: env.pusher.cluster,
      encrypted: true,
      forceTLS: true,
    });

    this.handleUserChange();
  }

  // PUBLIC METHODS
  subscribe(channels: string[]): void {
    messageEvent.forEach((e) => {
      channels.forEach((channel) => {
        this.echo.channel(channel).listen(e, (data: EchoMessage) => {
          data.readAt = null;
          this.message$.next({ event: e, content: data });
        });
      });
      this.channels = channels;
    });
  }

  unsubscribe(): void {
    messageEvent.forEach((e) => {
      this.channels.forEach((channel) => {
        this.echo.channel(channel).stopListening(e);
      });
    });
    this.channels = [];
  }

  // PRIVATE METHODS
  private handleUserChange(): void {
    this.appShellStore
      .select(selectTeacher)
      .pipe(
        tap((teacher) => {
          if (teacher) {
            this.subscribe(teacher.tags);
          } else {
            this.unsubscribe();
          }
        })
      )
      .subscribe();
  }
}
