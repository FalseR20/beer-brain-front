import UrlPattern from "url-pattern";

const baseUrlEnv = import.meta.env.VITE_DJANGO_URL;

export const URL_BASE = typeof baseUrlEnv == "undefined" ? "http://localhost:8000/" : baseUrlEnv;

export function make_url(urlPattern: UrlPatterns, values?: Record<string, string | number>) {
  return URL_BASE + new UrlPattern(urlPattern).stringify(values);
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
