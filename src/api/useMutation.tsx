import {
  createMutation as createSolidQueryMutation,
  MutationStatus as SolidQueryMutationStatus,
} from '@tanstack/solid-query'
import { BaseConfig, MutationStatus } from './types'
import { logRequestError } from './utils'

export const useMutation = <
  TData extends unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends { [key: string]: any } | undefined = undefined
>({
  name,
  handler,
  errorMessage,
}: { name: string; handler: ((args: TArgs) => Promise<TData>) | (() => Promise<TData>) } & BaseConfig) => {
  const solidQueryMutation = createSolidQueryMutation(handler, {
    onError: error => {
      logRequestError(name, error)
      // TODO: toast error
    },
  })

  const mutation = async (args: TArgs) => {
    try {
      const res = await solidQueryMutation.mutateAsync(args)
      return { isError: false, data: res } as const
    } catch (err: unknown) {
      // Deliberately not re-throwing or logging here
      return { isError: true, data: undefined } as const
    }
  }

  const mutationProperties = {
    data: {
      get() {
        return solidQueryMutation.data
      },
    },
    status: {
      get() {
        return getStatus(solidQueryMutation.status)
      },
    },
  }
  Object.defineProperties(mutation, mutationProperties)

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return mutation as (TArgs extends undefined
    ? () => ReturnType<typeof mutation>
    : (args: TArgs) => ReturnType<typeof mutation>) & {
    [K in keyof typeof mutationProperties]: ReturnType<typeof mutationProperties[K]['get']>
  }
}

const getStatus = (mutationStatus: SolidQueryMutationStatus): MutationStatus => {
  if (mutationStatus === 'idle') return undefined
  if (mutationStatus === 'loading') return 'fetching'
  return mutationStatus
}
