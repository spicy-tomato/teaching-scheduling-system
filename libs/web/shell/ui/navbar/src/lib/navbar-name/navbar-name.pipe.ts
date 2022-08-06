import { Pipe, PipeTransform } from '@angular/core';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';

@Pipe({
  name: 'navbarName',
})
export class NavbarNamePipe implements PipeTransform {
  transform(value: Nullable<Teacher>): string {
    if (value === null) {
      return 'người dùng';
    }

    if (value.permissions.includes(PermissionConstant.MANAGE_ROOM)) {
      return value.name;
    }

    return `${value.isFemale ? 'cô' : 'thầy'} ${value.name}`;
  }
}
