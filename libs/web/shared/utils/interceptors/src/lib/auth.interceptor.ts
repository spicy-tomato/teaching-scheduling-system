import { Location } from '@angular/common';
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
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // CONSTRUCTOR
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly appService: AppService,
    private readonly location: Location
  ) {}

  // IMPLEMENTATIONS
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.accessTokenService.get() || '';
    const headers = req.headers.set('Authorization', token);
    const authReq = req.clone({ headers });

    return next.handle(authReq).pipe(
      tap({
        error: (error) => {
          if (!(error instanceof HttpErrorResponse)) return;
          const currentUrl = this.location.path();

          switch (error.status) {
            case 401: {
              const token = error.headers.get('Authorization');
              if (token) {
                this.accessTokenService.save(token);
              } else if (!currentUrl.includes('login')) {
                this.accessTokenService.clear();
                this.appService.redirectToLogin(currentUrl);
              }
            }
          }
        },
      })
    );
  }
}
