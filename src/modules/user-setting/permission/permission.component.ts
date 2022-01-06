import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tss-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionComponent {
  public data = dummyData;
  public readonly columns = [
    'id',
    'name',
    'email',
    'timeStart',
    'timeEnd',
    'actions',
  ];
}

const dummyData = [
  {
    name: 'Nguyễn Trần Hiếu',
    email: 'nthieu@utc.edu.vn',
    timeStart: new Date(2021, 11, 30),
    timeEnd: new Date(2022, 0, 30),
  },
  {
    name: 'Nguyễn Kim Sao',
    email: 'nksao@utc.edu.vn',
    timeStart: new Date(2021, 11, 1),
    timeEnd: new Date(2022, 0, 1),
  },
];
