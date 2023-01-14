/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { log } from 'logger/logger'
import { is, isArrayOf, isNull, isUndefined } from 'ts-guardian'

export const createQueryId = (key: string, ...params: any[]) => `${key}-${JSON.stringify(params)}`

export const logRequestError = (queryId: string, error: unknown) => {
  queryId = queryId.split('-')[0] // See `createQueryId()`

  // Ignore aborted requests (just like in raygun config in setupRaygun.tsx)
  if (is({ code: 'string' })(error) && error.code === 'ECONNABORTED') return

  const isNetworkError = is({ response: { status: 'number' } })(error)

  if (isNetworkError) {
    const { status: httpCode } = error.response
    if (httpCode >= 401 && httpCode < 500) return // Exclude 4xx errors (but include bad requests)
    log.error(`${queryId} - request error`, { error })
    return
  }

  const message = is({ message: 'string' })(error) ? error.message : 'query error'

  log.error(`${queryId} - ${message}`, { error })
}

// Used to replace 'null' with 'undefined' in API responses so that Mayo doesn't need to deal with 'null'
export const nullToUndefined = (v: any): any => {
  if (isNull(v)) return undefined

  if (isArrayOf('any')(v)) {
    return v.map(nullToUndefined) as any
  }
  if (is({})(v)) {
    return Object.keys(v).reduce((res, k) => {
      ;(res as any)[k] = nullToUndefined((v as any)[k])
      return res
    }, {})
  }
  return v
}

// Used to replace 'undefined' with 'null' in API requests as Mayo treats everything as 'undefined'
export const undefinedToNull = (v: any): any => {
  if (isUndefined(v)) return null

  if (isArrayOf('any')(v)) {
    return v.map(undefinedToNull) as any
  }
  if (is({})(v)) {
    return Object.keys(v).reduce((res, k) => {
      ;(res as any)[k] = undefinedToNull((v as any)[k])
      return res
    }, {})
  }
  return v
}
