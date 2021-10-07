import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { BreadcrumbItem } from "@models/main-view/breadcrumb-item.model";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { routerNavigatedAction } from "@ngrx/router-store";
import { map } from "rxjs/operators";
import * as PageAction from "./main-view.page.actions";

@Injectable()
export class MainViewEffects {
  public changeRouter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      map((action) => {
        const breadcrumbs = this.createBreadcrumbs(action.payload.routerState.root);
        return PageAction.update({ breadcrumbs });
      })
    );
  });

  constructor(private actions$: Actions) { }

  private createBreadcrumbs(route: ActivatedRouteSnapshot, url = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeUrl = child.url
        .map(segment => segment.path)
        .join('/');

      if (routeUrl !== '') {
        url += `/${routeUrl}`;
      }

      const label = child.data['breadcrumb'] as string;
      if (label &&
        (breadcrumbs.length === 0 || label !== breadcrumbs[breadcrumbs.length - 1].label)
      ) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return [];
  }
}
