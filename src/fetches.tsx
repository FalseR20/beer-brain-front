import {make_url, UrlsBack} from "./urls.ts";
import getAuthHeaders, {deleteToken, setToken, TokenError} from "./tokens.ts";
import {IDetailedEvent, IEvent, IUser} from "./interfaces.ts";

export class ResponseError extends Error {
  status: number;

  constructor(response: Response) {
    super(response.statusText);
    this.status = response.status
  }
}

export type FetchError = ResponseError | TokenError

export async function catchUnauthorized(reason: FetchError): Promise<ResponseError> {
  if (reason instanceof TokenError) {
    window.location.href = "/guest";
    throw reason
  }
  return reason
}

export async function fetchSignIn(
  username: string,
  password: string,
): Promise<void> {
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

export async function fetchSignUp(username: string, password: string): Promise<void> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const url = make_url(UrlsBack.CREATE_USER);
  const response = await fetch(url, {method: "POST", body: formData});
  if (!response.ok) {
    throw new ResponseError(response);
  }
  return await fetchSignIn(username, password);
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
      throw new TokenError("Token is expired")
    }
    throw new ResponseError(response)
  }
  return response
}

export async function getEventList(): Promise<IEvent[]> {
  const response = await fetchWithAuthorization(make_url(UrlsBack.GET_EVENT_LIST))
  return await response.json()
}

export async function createEventAPI(inputs: { name: string }): Promise<IEvent> {
  const formData = new FormData();
  formData.append("name", inputs.name);
  formData.append("date", "2000-01-01");
  const url = make_url(UrlsBack.CREATE_EVENT)
  const response = await fetchWithAuthorization(url, {method: "POST", body: formData});
  return await response.json();
}

export async function joinEvent(event_id: string): Promise<void> {
  const url = make_url(UrlsBack.JOIN_EVENT, {eventId: event_id})
  await fetchWithAuthorization(url, {method: "POST"});
}

export async function leaveEvent(event_id: string): Promise<void> {
  const url = make_url(UrlsBack.LEAVE_EVENT, {eventId: event_id})
  await fetchWithAuthorization(url, {method: "POST"});
}

export async function getUser(username: string): Promise<IUser> {
  const url = make_url(UrlsBack.GET_USER, {username: username})
  const response = await fetchWithAuthorization(url);
  return await response.json()
}

export async function getMyUser(): Promise<IUser> {
  const url = make_url(UrlsBack.GET_MY_USER)
  const response = await fetchWithAuthorization(url);
  return await response.json()
}

export async function getDetailedEvent(eventId: string): Promise<IDetailedEvent> {
  const url = make_url(UrlsBack.GET_DETAILED_EVENT, {eventId: eventId})
  const response = await fetchWithAuthorization(url)
  return await response.json()
}