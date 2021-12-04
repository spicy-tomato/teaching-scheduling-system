import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '@services/core/token.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  /** CONSTRUCTOR */
  constructor(private tokenService: TokenService) {}

  /** IMPLEMENTATIONS */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.get() || '';

    const headers = req.headers
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('Expires', '0')
      .set('Pragma', 'no-cache')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', '*')
      .set('Authorization', token);

    const authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}
