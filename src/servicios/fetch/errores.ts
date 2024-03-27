export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly message: string,
    public readonly url: string,
    public readonly body: any,
  ) {
    super(message);
  }
}

export class ErrorFetchDesconocido extends Error {
  constructor(
    public readonly message: string,
    public readonly error: any,
  ) {
    super(message);
  }
}

export type FetchError = HttpError | ErrorFetchDesconocido;

export const esFetchError = (x: any): x is FetchError => {
  return (
    x !== null && x !== undefined && (x instanceof HttpError || x instanceof ErrorFetchDesconocido)
  );
};
