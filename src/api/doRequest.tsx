import axios from 'axios'
import { Params, Payload } from './types'
import { nullToUndefined, undefinedToNull } from './utils'

export const doRequest = async ({
  url,
  params,
  payload,
  method,
}: {
  url: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  params?: Params
  payload?: Payload | FormData
}) => {
  // FIXME: get real access token
  const accessToken = 'REPLACE_ME'
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return nullToUndefined(
    (
      await axios({
        url,
        method,
        params: params ? undefinedToNull(params) : undefined,
        // FormData used to upload files, sodn't undefinedToNull in that case
        data: payload ? (payload instanceof FormData ? payload : undefinedToNull(payload)) : undefined,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
    ).data
  ) as unknown
}
