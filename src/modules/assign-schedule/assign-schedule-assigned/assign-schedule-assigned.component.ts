import { Component } from '@angular/core';

@Component({
  selector: 'tss-assign-schedule-assigned',
  templateUrl: './assign-schedule-assigned.component.html',
  styleUrls: ['./assign-schedule-assigned.component.scss'],
})
export class AssignScheduleAssignedComponent {
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
