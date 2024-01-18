import {make_url, UrlPatterns} from "./constants.ts";

// async function fetchWithAuthorization(
//   urlPattern: UrlPatterns,
//   values?: Record<string, string | number>,
//   method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
//   body?: BodyInit,
// ): Promise<Response> {
//   const url = make_url(urlPattern, values);
//   const requestOptions: RequestInit = {
//     method: method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${localStorage["token"]}`,
//     },
//     body: body,
//   };
//   // if (!response.ok) {
//   //   throw new Error(`Request failed with status ${response.status}`);
//   // }
//   return await fetch(url, requestOptions);
// }

export async function signIn(
  username: string,
  password: string,
): Promise<boolean> {
  console.log(`SignIn ${username} by ${password}`);
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const url = make_url(UrlPatterns.GET_TOKEN);
  const response = await fetch(url, {method: "POST", body: formData});
  if (!response.ok) {
    return false;
  }
  const json = await response.json();
  const token = json["token"];
  localStorage.setItem("token", token);
  return true;
}

export async function signUp(
  username: string,
  password: string,
): Promise<boolean> {
  console.log(
    `SignUp ${username}`,
  );
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const url = make_url(UrlPatterns.CREATE_USER)
  const response = await fetch(url, {method: "POST", body: formData});
  if (!response.ok) {
    return false;
  }
  return await signIn(username, password);
}

export function signOut(): void {
  localStorage.removeItem("token");
}

export function isAuthorized(): boolean {
  return "token" in localStorage;
}

export default function getAuthHeader() {
  return {
    Authorization: `Token ${localStorage["token"]}`,
  };
}


