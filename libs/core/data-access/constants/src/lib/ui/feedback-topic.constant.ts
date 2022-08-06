import {
  tuiIconDesktopLarge,
  tuiIconSettingsLarge,
  tuiIconStarLarge,
} from '@taiga-ui/icons';

export interface FeedbackItem {
  key: number;
  label: string;
  icon: string;
}

export class FeedbackConstant {
  static readonly items: FeedbackItem[] = [
    { key: 0, label: 'Chung', icon: tuiIconStarLarge },
    { key: 1, label: 'Giao diện', icon: tuiIconDesktopLarge },
    { key: 2, label: 'Chức năng', icon: tuiIconSettingsLarge },
  ];
}
