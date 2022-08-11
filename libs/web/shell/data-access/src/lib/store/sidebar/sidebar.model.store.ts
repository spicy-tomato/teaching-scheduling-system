export type SidebarField =
  | 'calendar.study'
  | 'calendar.exam'
  | `calendar.@${string}`;
export type SidebarStateEvent = {
  name: SidebarField;
  value: boolean;
};
export type SidebarEvent =
  | SidebarStateEvent
  | {
      name: 'calendar.create';
      value: SidebarField[];
    };

export type SidebarEventName = SidebarEvent['name'];
export type ExtractValue<T extends SidebarEventName> = {
  [K in SidebarEvent as K['name']]: K['name'] extends T ? K['value'] : never;
}[T];
