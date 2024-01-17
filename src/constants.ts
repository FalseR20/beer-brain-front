const baseUrlEnv = import.meta.env.VITE_DJANGO_URL;

export const URL_BASE = typeof baseUrlEnv == "undefined" ? "http://localhost:8000/" : baseUrlEnv;

function url(path: string): string {
  return URL_BASE + path;
}

export class URLS {
  static get_token = url("users/token/");
  static create_user = url("users/new/");
  static get_my_user = url("users/me/");
  static change_password = url("me/change-password/");
  static get_event_list = url("events/");
  static create_event = url("events/new/");

  static get_user = (profile_id: string) => url(`users/id/${profile_id}/`);

  static rud_event = (event_id: string) => url(`events/${event_id}/`);
  static join_event = (event_id: string) => url(`events/${event_id}/join/`);
  static leave_event = (event_id: string) => url(`events/${event_id}/leave/`);
  static get_detailed_event = (event_id: string | number) => url(`events/${event_id}/detailed/`);

  static get_deposit_list = (event_id: string) => url(`events/${event_id}/deposits/`);
  static create_deposit = (event_id: string) => url(`events/${event_id}/deposits/new`);
  static rud_deposit = (event_id: string, deposit_id: string) => url(`events/${event_id}/deposits/${deposit_id}/`);

  static get_repayment_list = (event_id: string) => url(`events/${event_id}/repayments/`);
  static create_repayment = (event_id: string) => url(`events/${event_id}/repayments/new`);
  static rud_repayment = (event_id: string, repayment_id: string) => url(`events/${event_id}/repayments/${repayment_id}/`);
}
