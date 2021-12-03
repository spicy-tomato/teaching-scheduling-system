import { BreadcrumbItem } from '@models/main-view/breadcrumb-item.model';
import { AppState } from '@modules/app/state/app.reducer';

export interface MainViewState extends AppState {
  breadcrumbs: BreadcrumbItem[];
}
