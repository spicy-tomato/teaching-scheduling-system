import { Pipe, PipeTransform } from '@angular/core';
import { Teacher } from '@models/core/teacher.model';

@Pipe({
  name: 'navbarName',
})
export class NavbarNamePipe implements PipeTransform {
  public transform(value?: Teacher): string {
    return value === undefined
      ? 'người dùng'
      : `${value.isFemale ? 'cô' : 'thầy'} ${value.name}`;
  }
}
