import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InterceptorCustomHeader } from './constants';

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
  // IMPLEMENTATIONS
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!req.headers.get(InterceptorCustomHeader.skipContentType)) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json'),
      });
    }

    return next.handle(req);
  }
}
