import UrlPattern from "url-pattern";

const baseUrlEnv = import.meta.env.VITE_DJANGO_URL;

export const URL_BASE = baseUrlEnv || "http://localhost:8000/";

export function make_url(urlPattern: UrlsBack, values?: Record<string, string | number>) {
  return URL_BASE + new UrlPattern(urlPattern).stringify(values);
}

export function make_front_url(urlPattern: UrlsFront, values?: Record<string, string | number>) {
  return new UrlPattern(urlPattern).stringify(values);
}

export enum UrlsBack {
  GET_TOKEN = "users/token/",
  CREATE_USER = "users/new/",
  MY_USER = "users/me/",
  CHANGE_PASSWORD = "users/me/change-password/",
  GET_USER = "users/username/:username/",
  GET_USER_BY_ID = "users/id/:id/",

  GET_EVENT_LIST = "events/",
  CREATE_EVENT = "events/new/",
  RUD_EVENT = "events/:eventId/",
  JOIN_EVENT = "events/:eventId/join/",
  LEAVE_EVENT = "events/:eventId/leave/",
  CHANGE_EVENT_HOST = "events/:eventId/change-host/",

  GET_DEPOSIT_LIST = "events/:eventId/deposits/",
  CREATE_DEPOSIT = "events/:eventId/deposits/new/",
  RUD_DEPOSIT = "events/:eventId/deposits/:depositId/",

  GET_REPAYMENT_LIST = "events/:eventId/repayments/",
  CREATE_REPAYMENT = "events/:eventId/repayments/new/",
  RUD_REPAYMENT = "events/:eventId/repayments/:repaymentId/",

  GET_ALL_NOTIFICATIONS = "notifications/",
  GET_UNREAD_NOTIFICATIONS = "notifications/unread/",
  MARK_NOTIFICATIONS_READ = "notifications/mark-read/",
}

export enum UrlsFront {
  HOME = "/",
  GUEST = "/guest",
  SIGN_IN = "/sign_in",
  SIGN_UP = "/sign_up",
  EVENT = "/events/:eventId",
  EVENT_SETTINGS = "/events/:eventId/settings",
  EVENT_MEMBER = "/events/:eventId/members/:username",
  DEPOSIT = "/events/:eventId/deposits/:depositId",
  REPAYMENT = "/events/:eventId/repayment/:repaymentId",
  INVITE = "/invite/:eventId",
  USER_ME = "/users/me",
  USER = "/users/@/:username",
  CHANGE_PASSWORD = "/change-password",
  ABOUT = "/about",
}