import { FetchError } from '@/servicios/fetch';

export type FetchResponse<T> = [() => Promise<T>, () => void];

export type UnwrappedFetchResponse<T> = T extends FetchResponse<infer U> ? U : never;

export type UnwrappedManyFetchReponse<T extends [...any]> = T extends [infer Head, ...infer Tail]
  ? [UnwrappedFetchResponse<Head>, ...UnwrappedManyFetchReponse<Tail>]
  : [];

export type RemappedFetchResponseTuple<T extends [...FetchResponse<any>[]]> = [
  FetchError[],
  UnwrappedManyFetchReponse<T> | undefined[],
  boolean,
];

export type RemappedResponseFetchObject<T extends Record<string, FetchResponse<any>>> = [
  FetchError[],
  (
    | {
        [K in keyof T]: UnwrappedFetchResponse<T[K]>;
      }
    | undefined
  ),
  boolean,
];
