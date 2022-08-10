import { Nullable } from "@teaching-scheduling-system/core/data-access/models";

export const messageEvent = ['.notification-created'] as const;
export type MessageEvent = typeof messageEvent[number];

export type EchoMessage = {
  id: number;
  data: {
    content: string;
  };
  type: number;
  createdAt: string;
  updatedAt: string;
  readAt: Nullable<string>;
  sender: string;
};
