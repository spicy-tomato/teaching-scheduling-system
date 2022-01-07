import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessTokenService } from '@services/core/access-token.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  /** CONSTRUCTOR */
  constructor(
    private router: Router,
    private accessTokenService: AccessTokenService
  ) {}

  /** IMPLEMENTATIONS */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.accessTokenService.get() || '';

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
                this.accessTokenService.save(token);
              } else {
                this.accessTokenService.clear();
                void this.router.navigate(['/login']);
              }
            }
          }
        }
      )
    );
  }
}
