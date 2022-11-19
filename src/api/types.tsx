/* eslint-disable @typescript-eslint/no-explicit-any */

export type Params = Record<string, unknown>

export type Payload = Record<string, unknown> | Record<string, unknown>[]

export type Request = {
  url: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  params?: Params
  payload?: Payload
}

export type BaseConfig = { errorMessage?: string }

export type Config<TOptions extends unknown = undefined> = TOptions extends undefined
  ? () => BaseConfig
  : () => TOptions & BaseConfig

export type QueryStatus = 'success' | 'error' | 'fetching' | undefined
export type MutationStatus = QueryStatus
