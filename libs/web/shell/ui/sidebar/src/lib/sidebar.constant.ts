import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { SidebarItem } from '@teaching-scheduling-system/core/data-access/models';

export class SidebarConstant {
  public static items: SidebarItem[] = [
    // {
    //   name: 'Học phần',
    //   icon: 'far fa-book',
    //   subItems: [
    //     { name: 'Thông tin học phần', routerLink: '' },
    //     { name: 'Thêm học phần', routerLink: '' },
    //   ],
    // },
    // {
    //   name: 'Giảng viên',
    //   icon: 'far fa-chalkboard-teacher',
    //   subItems: [
    //     { name: 'Thông tin giảng viên', routerLink: '' },
    //     { name: 'Thêm giảng viên', routerLink: '' },
    //   ],
    // },
    // {
    //   name: 'Lớp học phần',
    //   icon: 'far fa-users-class',
    //   subItems: [{ name: 'Thông tin lớp học phần', routerLink: '' }],
    // },
    {
      controlName: 'calendar',
      name: 'Lịch biểu',
      icon: 'far fa-calendar-alt',
      routerLink: '/calendar',
      subCheckboxes: [
        {
          controlName: 'study',
          name: 'Lịch giảng dạy',
        },
        {
          controlName: 'exam',
          name: 'Lịch thi',
        },
      ],
    },
    {
      name: 'Phân giảng',
      icon: 'far fa-pencil-paintbrush',
      permission: PermissionConstant.ASSIGN_SCHEDULE,
      subItems: [
        {
          name: 'Danh sách phân giảng',
          routerLink: '/schedule/assign',
          icon: 'mdi mdi-format-list-bulleted',
        },
        {
          name: 'Nhập dữ liệu',
          routerLink: '/schedule/import',
          icon: 'tuiIconUpload',
          useTaigaIcon: true,
        },
      ],
    },
    {
      name: 'Lịch thi',
      icon: 'mdi mdi-calendar-clock',
      permission: PermissionConstant.ASSIGN_SCHEDULE,
      subItems: [
        {
          name: 'Phân lịch thi',
          routerLink: '/exam/assign',
          icon: 'mdi mdi-format-list-bulleted',
        },
        // {
        //   name: 'Import',
        //   routerLink: '/assign-schedule/import',
        //   icon: 'tuiIconUpload',
        //   useTaigaIcon: true,
        // },
      ],
    },
    {
      name: 'Thay đổi lịch',
      icon: 'fas fa-exchange-alt',
      routerLink: '/schedule/change',
      exactRouterLink: false,
    },
    // {
    //   name: 'Thông báo',
    //   icon: 'far fa-bell',
    //   routerLink: '/notification',
    //   subItems: [
    //     { name: 'Tạo thông báo mới', routerLink: '/notification/create' },
    //     { name: 'Xem tất cả thông báo', routerLink: '/notification' },
    //   ],
    // },
    // {
    //   name: 'Quản lý phân quyền',
    //   icon: 'fad fa-user-shield',
    //   routerLink: '/user-setting/permission',
    //   permission: PermissionConstant.AUTHORIZE_DEPARTMENT_PERMISSION,
    // },
    {
      name: 'Thống kê',
      icon: 'far fa-chart-pie',
      routerLink: '/statistic',
      permission: PermissionConstant.STATISTICIZE_CHANGE_SCHEDULE,
    },
  ];
}
