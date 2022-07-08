import { DatePipe } from '@angular/common';
import { Injectable, InjectionToken } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public static readonly DATE_PIPE_TOKEN = new InjectionToken<DatePipe>(
    'datePipe'
  );

  public getToken<T>(name: string): InjectionToken<T> {
    if (name === 'datePipe') {
      return TokenService.DATE_PIPE_TOKEN;
    }

    throw `No token with name ${name} found`;
  }
}
