import { Observable } from 'rxjs';
import { Nullable } from 'src/shared/models';

export interface ICanDeactivateComponent {
  canDeactivate: () => Nullable<
    Observable<boolean> | Promise<boolean> | boolean
  >;
}
