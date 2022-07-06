import {
  tuiIconCommentLarge,
  tuiIconLogoutLarge,
  tuiIconSettingsLarge,
} from '@taiga-ui/icons';
import { NavbarGroup } from '@teaching-scheduling-system/core/data-access/models';

export class NavbarConstants {
  public static keys = {
    USER_INFO: 'user-info',
    COMMENTS: 'comments',
    SETTINGS: 'settings',
    CHANGE_PASSWORD: 'change-password',
    HELP: 'help',
    LOG_OUT: 'log-out',
  };

  public static items: NavbarGroup[] = [
    {
      items: [
        {
          key: NavbarConstants.keys.USER_INFO,
          label: 'Thông tin cá nhân',
          routerLink: '/user-info',
          icon: '<i class="far fa-user" style="font-size: 23px"></i>',
        },
      ],
    },
    {
      items: [
        {
          key: NavbarConstants.keys.COMMENTS,
          label: 'Đóng góp ý kiến',
          routerLink: '/feedback',
          icon: tuiIconCommentLarge,
        },
        {
          key: NavbarConstants.keys.CHANGE_PASSWORD,
          label: 'Cài đặt',
          routerLink: '/settings',
          icon: tuiIconSettingsLarge,
        },
      ],
    },
    {
      items: [
        // {
        //   key: NavbarConstants.keys.HELP,
        //   label: 'Trợ giúp & hỗ trợ',
        //   routerLink: '',
        //   icon: tuiIconHelpCircleLarge,
        //   externalLink: true,
        // },
        {
          key: NavbarConstants.keys.LOG_OUT,
          label: 'Đăng xuất',
          icon: tuiIconLogoutLarge,
        },
      ],
    },
  ];
}
