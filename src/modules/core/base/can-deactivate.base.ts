import { Observable } from 'rxjs';

export interface ICanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean | null;
}
