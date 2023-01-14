/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { is } from 'ts-guardian'

export const log = {
  error: (err: string | Error, customData?: Record<string, unknown>) => {
    customData = spreadDeep(customData) as Record<string, unknown>

    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') console.error(err, customData)

    const error = typeof err === 'string' ? new Error(err) : err
    // TODO: send error and custom data to logging service here
  },
}

// Used to destructure Error instances to retrieve their "own properties" and create
// plain objects from them, as Error's own properties are not kept when using JSON.stringify 🥴
const spreadDeep = (data: unknown) => {
  if (!is({})(data)) return data
  return Object.getOwnPropertyNames(data).reduce<Record<PropertyKey, unknown>>((obj: any, key) => {
    obj[key] = spreadDeep((data as any)[key])
    return obj as Record<PropertyKey, unknown>
  }, {})
}
