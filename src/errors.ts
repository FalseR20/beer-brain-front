export class FetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status
  }
}

export class TokenError extends FetchError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ResponseError extends FetchError {
  response: Response
  constructor(response: Response) {
    super(response.statusText, response.status);
    this.response = response
  }
}
