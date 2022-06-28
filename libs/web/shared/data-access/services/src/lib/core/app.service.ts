import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private readonly router: Router) {}

  public redirectToLogin(redirect?: string): void {
    void this.router.navigate(['/login'], {
      queryParams: { redirect: redirect || null },
    });
  }

  public redirectToApp(redirect?: Nullable<string>): void {
    if (redirect) {
      void this.router.navigate([redirect]);
      return;
    }

    void this.router.navigate(['/']);
  }
}
