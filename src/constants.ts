import UrlPattern from "url-pattern";

const baseUrlEnv = import.meta.env.VITE_DJANGO_URL;

export const URL_BASE = typeof baseUrlEnv == "undefined" ? "http://localhost:8000/" : baseUrlEnv;

function u(path: string): string {
  return URL_BASE + path;
}

export class URLS {
  // Deprecated
  static get_token = u("users/token/");
  static create_user = u("users/new/");
  static get_my_user = u("users/me/");
  static change_password = u("users/me/change-password/");
  static get_user = (profile_id: string) => u(`users/id/${profile_id}/`);

  static get_event_list = u("events/");
  static create_event = u("events/new/");
  static rud_event = (event_id: string) => u(`events/${event_id}/`);
  static join_event = (event_id: string) => u(`events/${event_id}/join/`);
  static leave_event = (event_id: string) => u(`events/${event_id}/leave/`);
  static get_detailed_event = (event_id: string | number) => u(`events/${event_id}/detailed/`);

  static get_deposit_list = (event_id: string) => u(`events/${event_id}/deposits/`);
  static create_deposit = (event_id: string) => u(`events/${event_id}/deposits/new`);
  static rud_deposit = (event_id: string, deposit_id: string) => u(`events/${event_id}/deposits/${deposit_id}/`);

  static get_repayment_list = (event_id: string) => u(`events/${event_id}/repayments/`);
  static create_repayment = (event_id: string) => u(`events/${event_id}/repayments/new`);
  static rud_repayment = (event_id: string, repayment_id: string) => u(`events/${event_id}/repayments/${repayment_id}/`);
}

export enum UrlPatterns {
  GET_TOKEN = "users/token/",
  CREATE_USER = "users/new/",
  GET_MY_USER = "users/me/",
  CHANGE_PASSWORD = "users/me/change-password/",
  GET_USER = "users/me/id/:username/",

  GET_EVENT_LIST = "events/",
  CREATE_EVENT = "events/new/",
  RUD_EVENT = "events/:eventId/",
  JOIN_EVENT = "events/:eventId/join/",
  LEAVE_EVENT = "events/:eventId/leave/",
  GET_DETAILED_EVENT = "events/:eventId/detailed/",

  GET_DEPOSIT_LIST = "events/:eventId/deposits/",
  CREATE_DEPOSIT = "events/:eventId/deposits/new/",
  RUD_DEPOSIT = "events/:eventId/deposits/:depositId/",

  GET_REPAYMENT_LIST = "events/:eventId/repayments/",
  CREATE_REPAYMENT = "events/:eventId/repayments/new/",
  RUD_REPAYMENT = "events/:eventId/repayments/:repaymentId/",

}

export function make_url(urlPattern: UrlPatterns, values?: Record<string, string | number>) {
  return URL_BASE + new UrlPattern(urlPattern).stringify(values);
}
