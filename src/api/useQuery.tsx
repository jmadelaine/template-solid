import {
  QueryStatus as SolidQueryQueryStatus,
  createQuery as createSolidQueryQuery,
  useQueryClient as useSolidQueryQueryClient,
} from '@tanstack/solid-query'
import { BaseConfig, QueryStatus } from './types'
import { logRequestError } from './utils'

type UseQueryParams<TData extends unknown> = { id: string; handler: () => Promise<TData> } & BaseConfig

export const useQuery = <TData extends unknown>({ id, handler, errorMessage }: UseQueryParams<TData>) => {
  const queryClient = useSolidQueryQueryClient()

  const solidQueryQuery = createSolidQueryQuery(() => [id], handler, {
    // 'enabled: false' prevents fetch on mount
    enabled: false,
    onError: (error: unknown) => {
      // TODO: toast error
      logRequestError(id, error)
    },
  })

  const query = async () => {
    try {
      const res = await solidQueryQuery.refetch({ throwOnError: true })
      return { isError: false, data: res.data } as const
    } catch (err: unknown) {
      // Deliberately not re-throwing or logging here
      return { isError: true, data: undefined } as const
    }
  }

  const queryProperties = {
    data: {
      get() {
        return solidQueryQuery.data
      },
    },
    status: {
      get() {
        return getStatus(solidQueryQuery.status, solidQueryQuery.isFetching)
      },
    },
    update: {
      get() {
        return (cacheUpdater: (cache: TData | undefined) => TData | undefined) => {
          queryClient.setQueryData([id], cacheUpdater(queryClient.getQueryData([id])))
        }
      },
    },
  }
  Object.defineProperties(query, queryProperties)

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return query as typeof query & { [K in keyof typeof queryProperties]: ReturnType<typeof queryProperties[K]['get']> }
}

const getStatus = (queryStatus: SolidQueryQueryStatus, isFetching: boolean): QueryStatus => {
  // if (queryStatus === 'idle') return undefined
  if (isFetching || queryStatus === 'loading') return 'fetching'
  return queryStatus
}
