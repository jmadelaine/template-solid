import axios from 'axios'
import { Params, Payload } from './types'
import { nullToUndefined, undefinedToNull } from './utils'

export const buildRequest =
  ({
    url,
    params,
    payload,
    method,
    accessToken,
  }: {
    url: string
    method: 'get' | 'post' | 'put' | 'patch' | 'delete'
    params?: Params
    payload?: Payload
    accessToken: string | undefined
  }) =>
  async (): Promise<unknown> => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return nullToUndefined(
      (
        await axios({
          url,
          method,
          params: params ? undefinedToNull(params) : undefined,
          data: payload ? undefinedToNull(payload) : undefined,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
      ).data
    ) as unknown
  }
