import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = req.headers
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('Expires', '0')
      .set('Pragma', 'no-cache')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', '*');

    

    const authReq = req.clone({ headers });
    
    return next.handle(authReq);
  }
}
