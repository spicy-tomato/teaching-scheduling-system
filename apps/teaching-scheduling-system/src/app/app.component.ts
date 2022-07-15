import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  /** PRIVATE PROPERTIES */
  private readonly defaultTitle = 'Hệ thống quản lý lịch giảng dạy UTCKetnoi';
  private setTitle = false;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly title: Title,
    private readonly destroy$: TuiDestroyService
  ) {}

  /** IMPLEMENTATIONS */
  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let route = this.router.routerState.root;
          while (route.firstChild) {
            route = route.firstChild;
          }

          const snapshotData = route.snapshot.data;
          const routeTitle =
            snapshotData['title'] || snapshotData['breadcrumb'];
          if (routeTitle) {
            this.setTitle = true;
            this.title.setTitle(`${routeTitle} | ${this.defaultTitle}`);
          } else if (this.setTitle) {
            this.setTitle = false;
            this.title.setTitle(this.defaultTitle);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
