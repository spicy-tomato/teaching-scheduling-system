import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AccessTokenService,
  AppService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InterceptorCustomHeader } from './constants';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  /** CONSTRUCTOR */
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly appService: AppService
  ) {}

  /** IMPLEMENTATIONS */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.accessTokenService.get() || '';

    let headers = req.headers.set('Authorization', token);

    if (!req.headers.get(InterceptorCustomHeader.skipContentType)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const authReq = req.clone({ headers });

    return next.handle(authReq).pipe(
      tap({
        error: (error) => {
          if (!(error instanceof HttpErrorResponse)) return;

          switch (error.status) {
            case 401: {
              const token = error.headers.get('Authorization');
              if (token) {
                this.accessTokenService.save(token);
              } else {
                this.accessTokenService.clear();
                this.appService.redirectToLogin();
              }
            }
          }
        },
      })
    );
  }
}
