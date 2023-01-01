export type GoogleCalendarType = `calendar.@${string}`;

export type SidebarField =
  | 'calendar.study'
  | 'calendar.exam'
  | GoogleCalendarType;

export type SidebarEvent =
  | {
      name: SidebarField;
      value: boolean;
    }
  | {
      name: 'calendar.create';
      value: SidebarField[];
    };

export type SidebarEventName = SidebarEvent['name'];
export type ExtractValue<T extends SidebarEventName> = {
  [K in SidebarEvent as K['name']]: K['name'] extends T ? K['value'] : never;
}[T];
