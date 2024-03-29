import {TokenError} from "./errors.ts";

const TOKEN = "token"


export function setToken(token: string) {
  localStorage.setItem(TOKEN, `Token ${token}`);
}

export function deleteToken(): void {
  localStorage.removeItem(TOKEN)
}

export function isTokenExist(): boolean {
  return TOKEN in localStorage;
}

export function getToken(): string {
  const token = localStorage.getItem(TOKEN)
  if (token == null) {
    throw new TokenError("No token provided")
  }
  return token;
}

export default function getAuthHeaders() {
  const token = getToken()
  const headers = new Headers()
  headers.append("Authorization", token)
  return headers;
}


