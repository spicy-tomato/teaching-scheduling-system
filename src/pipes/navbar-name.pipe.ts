import { Pipe, PipeTransform } from '@angular/core';
import { Nullable, Teacher } from 'src/shared/models';

@Pipe({
  name: 'navbarName',
})
export class NavbarNamePipe implements PipeTransform {
  public transform(value: Nullable<Teacher>): string {
    return value === null
      ? 'người dùng'
      : `${value.isFemale ? 'cô' : 'thầy'} ${value.name}`;
  }
}
