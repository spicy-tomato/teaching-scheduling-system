import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { BaseDataService } from './base-data.service';

@Injectable({providedIn: 'root'})
export class NotificationService extends BaseDataService {
  public createModuleNotification(value: unknown): Observable<unknown> {
    return of(null).pipe(delay(1000), tap(() => value));
  }
}
