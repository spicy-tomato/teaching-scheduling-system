import { SidebarItem } from '@models/sidebar/sidebar-item.model';

export class SidebarConstant {
  public static items: SidebarItem[] = [
    {
      name: 'Học phần',
      icon: 'far fa-book',
      subItems: [
        { name: 'Thông tin học phần', routerLink: '' },
        { name: 'Thêm học phần', routerLink: '' },
      ],
    },
    {
      name: 'Giảng viên',
      icon: 'far fa-chalkboard-teacher',
      subItems: [
        { name: 'Thông tin giảng viên', routerLink: '' },
        { name: 'Thêm giảng viên', routerLink: '' },
      ],
    },
    {
      name: 'Lớp học phần',
      icon: 'far fa-users-class',
      subItems: [{ name: 'Thông tin lớp học phần', routerLink: '' }],
    },
    {
      name: 'Lịch giảng dạy',
      icon: 'far fa-calendar-alt',
      subItems: [
        { name: 'Thông tin giờ giảng', routerLink: '/schedule' },
        { name: 'Yêu cầu thay đổi', routerLink: '' },
      ],
    },
    {
      name: 'Phân giảng',
      icon: 'far fa-pencil-paintbrush',
      subItems: [
        { name: 'Lớp phân giảng', routerLink: '' },
        { name: 'Danh sách phân giảng', routerLink: '' },
      ],
    },
    {
      name: 'Nhập file',
      icon: 'far fa-file-import',
      subItems: [
        { name: 'Thêm giảng viên', routerLink: '' },
        { name: 'Thêm lớp học phần', routerLink: '' },
      ],
    },
    {
      name: 'Thông báo',
      icon: 'far fa-bell',
      routerLink: '/notification',
      subItems: [
        { name: 'Tạo thông báo mới', routerLink: '/notification/create' },
        { name: 'Xem tất cả thông báo', routerLink: '/notification' },
      ],
    },
    {
      name: 'Quản lý phân quyền',
      icon: 'fad fa-user-shield',
      routerLink: '/user-setting/permission',
    },
    {
      name: 'Thống kê',
      icon: 'far fa-chart-pie',
    },
  ];
}
