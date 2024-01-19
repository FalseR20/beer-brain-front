const TOKEN = "token"

class TokenError extends Error {
}


export function setToken(token: string) {
  localStorage.setItem(TOKEN, `Token ${token}`);
}

export function deleteToken(): void {
  localStorage.removeItem(TOKEN)
}

export function isAuthorized(): boolean {
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


