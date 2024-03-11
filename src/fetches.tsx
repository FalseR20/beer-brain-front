import {make_url, UrlsBack} from "./urls.ts";
import getAuthHeaders, {deleteToken, setToken} from "./tokens.ts";
import {
  CDeposit,
  CDetailedEvent,
  CDetailedUser,
  CEvent,
  CRepayment,
  CUser
} from "./dataclasses.ts";
import {IDeposit, IEvent, IRepayment, IUser} from "./interfaces.ts";
import {BANK_FORMAT} from "./constants.ts";
import {FetchError, ResponseError, TokenError} from "./errors.ts";

export function redirectGuest(reason: FetchError) {
  if (reason instanceof TokenError) {
    window.location.href = "/guest";
  }
}

export async function fetchSignIn({username, password}: {
  username: string,
  password: string
}): Promise<void> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const url = make_url(UrlsBack.GET_TOKEN);
  const response = await fetch(url, {method: "POST", body: formData})
  if (!response.ok) {
    throw new ResponseError(response);
  }
  const json = await response.json();
  setToken(json["token"]);
}

export async function fetchSignUp({fullName, password, username}: {
  username: string,
  password: string,
  fullName: string
}): Promise<void> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  if (fullName != "") {
    formData.append("full_name", fullName);
  }

  const url = make_url(UrlsBack.CREATE_USER);
  const response = await fetch(url, {method: "POST", body: formData});
  if (!response.ok) {
    throw new ResponseError(response);
  }
  return await fetchSignIn({username, password});
}

export async function signOut(): Promise<void> {
  deleteToken()
}

async function fetchWithAuthorization(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (init == undefined) {
    init = {}
  }
  init.headers = getAuthHeaders()
  const response = await fetch(input, init)
  if (!response.ok) {
    if (response.status == 401) {
      deleteToken()
      throw new TokenError(response.statusText)
    }
    throw new ResponseError(response)
  }
  return response
}

export async function getEventList(): Promise<CEvent[]> {
  const response = await fetchWithAuthorization(make_url(UrlsBack.GET_EVENT_LIST))
  const json: IEvent[] = await response.json()
  return json.map(event => new CEvent(event))
}

export async function createEventAPI(inputs: {
  name: string,
  description: string,
  date: string
}): Promise<CEvent> {
  const formData = new FormData();
  formData.append("name", inputs.name);
  formData.append("description", inputs.description);
  formData.append("date", inputs.date);
  const url = make_url(UrlsBack.CREATE_EVENT)
  const response = await fetchWithAuthorization(url, {method: "POST", body: formData});
  const json: IEvent = await response.json();
  return new CEvent(json)
}

export async function updateEvent(eventId: string, inputs: {
  name: string,
  description: string,
  date: string
}): Promise<CEvent> {
  const formData = new FormData();
  formData.append("name", inputs.name);
  formData.append("description", inputs.description);
  formData.append("date", inputs.date);
  const url = make_url(UrlsBack.RUD_EVENT, {eventId: eventId});
  const response = await fetchWithAuthorization(url, {method: "PUT", body: formData});
  const json: IEvent = await response.json();
  return new CEvent(json)
}

export async function joinEvent(event_id: string): Promise<void> {
  const url = make_url(UrlsBack.JOIN_EVENT, {eventId: event_id})
  await fetchWithAuthorization(url, {method: "POST"});
}

export async function leaveEvent(event_id: string): Promise<void> {
  const url = make_url(UrlsBack.LEAVE_EVENT, {eventId: event_id})
  await fetchWithAuthorization(url, {method: "POST"});
}

export async function deleteEvent(eventId: string) {
  const url = make_url(UrlsBack.RUD_EVENT, {eventId: eventId})
  const response = await fetchWithAuthorization(url, {method: "DELETE"});
  if (!response.ok) {
    throw new ResponseError(response);
  }
}

export async function getUser(username: string): Promise<CUser> {
  const url = make_url(UrlsBack.RUD_USER, {username: username})
  const response = await fetchWithAuthorization(url);
  const json: IUser = await response.json()
  return new CUser(json)
}

export async function getMyUser(): Promise<CUser> {
  const url = make_url(UrlsBack.MY_USER)
  const response = await fetchWithAuthorization(url);
  const json: IUser = await response.json()
  return new CUser(json)
}

export async function getEvent(eventId: string): Promise<CEvent> {
  const url = make_url(UrlsBack.RUD_EVENT, {eventId: eventId})
  const response = await fetchWithAuthorization(url)
  const json: IEvent = await response.json()
  return new CEvent(json)
}

export async function getDetailedEvent(eventId: string): Promise<CDetailedEvent> {
  const url = make_url(UrlsBack.RUD_EVENT, {eventId: eventId})
  const response = await fetchWithAuthorization(url)
  const json: IEvent = await response.json()
  return new CDetailedEvent(json)
}

export async function getEventMember(eventId: string, username: string): Promise<{
  detailedEvent: CDetailedEvent;
  user: CDetailedUser
}> {
  const detailedEvent = await getDetailedEvent(eventId)
  const user = detailedEvent.users.find(detailedUser => detailedUser.username == username)
  if (!user) {
    throw new FetchError("Unknown user", 404);
  }
  return {detailedEvent, user}
}

export async function createDeposit(inputs: {
  value: number,
  description: string
}, event: CEvent): Promise<CDeposit> {
  const formData = new FormData();
  formData.append("value", BANK_FORMAT.format(inputs.value));
  formData.append("description", inputs.description);
  const url = make_url(UrlsBack.CREATE_DEPOSIT, {eventId: event.id})
  const response = await fetchWithAuthorization(url, {method: "POST", body: formData});
  const json: IDeposit = await response.json();
  return new CDeposit(json)
}

export async function updateDeposit(inputs: {
  value: number,
  description: string,
  payedAt: string
}, eventId: string, deposit: CDeposit): Promise<CDeposit> {
  const formData = new FormData();
  formData.append("value", BANK_FORMAT.format(inputs.value));
  formData.append("description", inputs.description);
  // formData.append("payedAt", inputs.payedAt);  // TODO: add possibility to change datetime
  const url = make_url(UrlsBack.RUD_DEPOSIT, {eventId, depositId: deposit.id})
  const response = await fetchWithAuthorization(url, {method: "PUT", body: formData});
  const json: IDeposit = await response.json();
  return new CDeposit(json)
}

export async function getDeposit(eventId: string, depositId: string): Promise<CDeposit> {
  const url = make_url(UrlsBack.RUD_DEPOSIT, {eventId, depositId})
  const response = await fetchWithAuthorization(url, {method: "GET"})
  const json: IDeposit = await response.json();
  return new CDeposit(json)
}

export async function deleteDeposit(eventId: string, depositId: string): Promise<void> {
  const url = make_url(UrlsBack.RUD_DEPOSIT, {eventId, depositId})
  await fetchWithAuthorization(url, {method: "DELETE"});
}

export async function createRepayment(inputs: {
  value: number,
  description: string,
  type: string,
  user: string,
}, event: CEvent): Promise<CRepayment> {
  const formData = new FormData();
  formData.append("value", BANK_FORMAT.format(inputs.value));
  formData.append("description", inputs.description);
  formData.append("recipient_username", inputs.user);

  const url = make_url(UrlsBack.CREATE_REPAYMENT, {eventId: event.id})
  const response = await fetchWithAuthorization(url, {method: "POST", body: formData});
  const json: IRepayment = await response.json();
  return new CRepayment(json)
}

export async function getRepayment(eventId: string, repaymentId: string): Promise<CRepayment> {
  const url = make_url(UrlsBack.RUD_REPAYMENT, {eventId, repaymentId})
  const response = await fetchWithAuthorization(url, {method: "GET"});
  const json: IRepayment = await response.json();
  return new CRepayment(json)
}

export async function updateRepayment(inputs: {
  value: number,
  description: string,
  type: string,
  user: string,
  payedAt: string,
}, event: CEvent, repayment: CRepayment): Promise<CRepayment> {
  const formData = new FormData();
  formData.append("value", BANK_FORMAT.format(inputs.value));
  formData.append("description", inputs.description);
  // formData.append("recipient_username", inputs.user);  TODO: implement
  // formData.append("payed_at", inputs.payedAt);  TODO: implement

  const url = make_url(UrlsBack.RUD_REPAYMENT, {eventId: event.id, repaymentId: repayment.id})
  const response = await fetchWithAuthorization(url, {method: "PUT", body: formData});
  const json: IRepayment = await response.json();
  return new CRepayment(json)
}

export async function deleteRepayment(eventId: string, repaymentId: string): Promise<void> {
  const url = make_url(UrlsBack.RUD_REPAYMENT, {eventId, repaymentId})
  await fetchWithAuthorization(url, {method: "DELETE"});
}

export async function updateUser(inputs: {
  username?: string,
  fullName?: string
}): Promise<CUser> {
  const formData = new FormData();
  if (inputs.username) {
    formData.append("username", inputs.username)
  }
  if (inputs.fullName) {
    formData.append("full_name", inputs.fullName);
  }

  const url = make_url(UrlsBack.MY_USER);
  const response = await fetchWithAuthorization(url, {method: "PATCH", body: formData});
  if (!response.ok) {
    throw new ResponseError(response);
  }
  const json: IUser = await response.json();
  return new CUser(json)
}
