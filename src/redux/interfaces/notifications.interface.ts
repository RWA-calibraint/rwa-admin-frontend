export interface Notification {
  _id: string;
  receiverId: string;
  message: string;
  url: string;
  __v: number;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  response_code: number;
  response_status: string;
  response: Notification[];
  response_error: null;
}

type id = string;
export type NotificationsParams = id;
