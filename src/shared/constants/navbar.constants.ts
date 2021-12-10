import { NavbarGroup } from '@models/navbar/navbar-item.model';
import { tuiIconLockLarge } from '@taiga-ui/icons';

export class NavbarConstants {
  public static keys = {
    PERSONAL_INFORMATION: 'personal-information',
    COMMENTS: 'comments',
    SETTINGS: 'settings',
    CHANGE_PASSWORD: 'change-password',
    HELP: 'help',
    LOG_OUT: 'log-out',
  };

  public static items: NavbarGroup[] = [
    // {
    //   items: [
    //     {
    //       key: NavbarConstants.keys.PERSONAL_INFORMATION,
    //       label: 'Thông tin cá nhân',
    //       routerLink: '',
    //       icon: '<i class="far fa-user" style="font-size: 23px"></i>',
    //     },
    //   ],
    // },
    // {
    //   items: [
    //     {
    //       key: NavbarConstants.keys.COMMENTS,
    //       label: `Đóng góp ý kiến`,
    //       routerLink: '',
    //       icon: tuiIconLikeLarge,
    //     },
    //   ],
    // },
    {
      items: [
        // {
        //   key: NavbarConstants.keys.SETTINGS,
        //   label: `Cài đặt`,
        //   routerLink: '',
        //   icon: tuiIconSettingsLarge,
        // },
        // {
        //   key: NavbarConstants.keys.HELP,
        //   label: `Trợ giúp & hỗ trợ`,
        //   routerLink: '',
        //   icon: '<i class="far fa-question-circle" style="font-size: 23px"></i>',
        // },
        {
          key: NavbarConstants.keys.CHANGE_PASSWORD,
          label: 'Đổi mật khẩu',
          routerLink: '/user-setting',
          icon: tuiIconLockLarge,
        },
        {
          key: NavbarConstants.keys.LOG_OUT,
          label: `Đăng xuất`,
          icon: '<i class="far fa-sign-out" style="font-size: 23px; transform: translateX(2px);"></i>',
        },
      ],
    },
  ];
}
