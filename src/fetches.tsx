import {make_url, UrlPatterns} from "./constants.ts";
import {deleteToken, setToken} from "./tokens.ts";

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

export function signOut(): void {
  deleteToken()
}