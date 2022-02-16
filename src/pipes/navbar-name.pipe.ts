import { Pipe, PipeTransform } from '@angular/core';
import { PermissionConstant } from '@shared/constants';
import { Nullable, Teacher } from 'src/shared/models';

@Pipe({
  name: 'navbarName',
})
export class NavbarNamePipe implements PipeTransform {
  public transform(value: Nullable<Teacher>): string {
    if (value === null) {
      return 'người dùng';
    }

    if (value.permissions.includes(PermissionConstant.MANAGE_ROOM)) {
      return value.name;
    }

    return `${value.isFemale ? 'cô' : 'thầy'} ${value.name}`;
  }
}
