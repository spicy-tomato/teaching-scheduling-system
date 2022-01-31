import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '@services/core/token.service';
import { tap } from 'rxjs/operators';
import { AppService } from '@services/core/app.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  /** CONSTRUCTOR */
  constructor(
    private readonly appService: AppService,
    private readonly tokenService: TokenService
  ) {}

  /** IMPLEMENTATIONS */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.get() || '';

    const headers = req.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    const authReq = req.clone({ headers });

    return next.handle(authReq).pipe(
      tap(
        () => undefined,
        (error) => {
          if (!(error instanceof HttpErrorResponse)) return;

          switch (error.status) {
            case 401: {
              const token = error.headers.get('Authorization');
              if (token) {
                this.tokenService.save(token);
              } else {
                this.tokenService.clear();
                this.appService.redirectToLogin();
              }
            }
          }
        }
      )
    );
  }
}
