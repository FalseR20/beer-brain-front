import {make_url, UrlPatterns} from "./constants.ts";
import getAuthHeaders, {deleteToken, setToken, TokenError} from "./tokens.ts";
import {IEvent, IUser} from "./interfaces.ts";

class FetchError extends Error {
}


export async function fetchSignIn(
  username: string,
  password: string,
): Promise<void> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const url = make_url(UrlPatterns.GET_TOKEN);
  const response = await fetch(url, {method: "POST", body: formData})
  if (!response.ok) {
    throw new FetchError("Invalid credentials");
  }
  const json = await response.json();
  setToken(json["token"]);
}

export async function fetchSignUp(username: string, password: string): Promise<void> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const url = make_url(UrlPatterns.CREATE_USER);
  const response = await fetch(url, {method: "POST", body: formData});
  if (!response.ok) {
    throw new FetchError("Invalid credentials");
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
  if (response.status == 401) {
    deleteToken();
    throw new TokenError("Token is expired.")
  }
  return response
}

export async function getEventList(): Promise<IEvent[]> {
  const response = await fetchWithAuthorization(make_url(UrlPatterns.GET_EVENT_LIST))
  return await response.json() as IEvent[]
}

export async function createEventAPI(inputs: { name: string }): Promise<IEvent> {
  const formData = new FormData();
  formData.append("name", inputs.name);
  formData.append("date", "2000-01-01");
  const response = await fetchWithAuthorization(make_url(UrlPatterns.CREATE_EVENT), {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new FetchError("Cannot to create event")
  }
  return await response.json() as IEvent;
}

export async function joinEvent(event_id: string): Promise<void> {
  const response = await fetchWithAuthorization(make_url(UrlPatterns.JOIN_EVENT, {eventId: event_id}), {
    method: "POST",
  });
  if (!response.ok) {
    throw new FetchError("Cannot join event");
  }
}

export async function leaveEvent(event_id: string): Promise<void> {
  const response = await fetchWithAuthorization(make_url(UrlPatterns.LEAVE_EVENT, {eventId: event_id}), {
    method: "POST",
  });
  if (!response.ok) {
    throw new FetchError("Cannot leave event");
  }
}

export async function getUser(username: string): Promise<IUser> {
  const response = await fetchWithAuthorization(make_url(UrlPatterns.GET_USER, {username: username}));
  if (!response.ok) {
    throw new FetchError("Cannot find user with that username");
  }
  const data = await response.json()
  return data as IUser;
}

export async function getMyUser(): Promise<IUser> {
  const response = await fetchWithAuthorization(make_url(UrlPatterns.GET_MY_USER));
  if (!response.ok) {
    throw new FetchError();
  }
  const data = await response.json()
  return data as IUser;
}
