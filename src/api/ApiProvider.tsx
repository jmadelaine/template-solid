import { QueryClient, QueryCache, QueryClientProvider, MutationCache } from '@tanstack/solid-query'
import { is } from 'ts-guardian'
import { PComp } from 'types/utils'

const hasMessage = is({ message: 'string' })

const includesHttp5xxErrorCode = (s: string) => /5[0-9][0-9]/.test(s)

const queryCache = new QueryCache()
const mutationCache = new MutationCache()

const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount: number, err: unknown) => {
        // Only retry 5xx errors
        if (hasMessage(err) && includesHttp5xxErrorCode(err.message)) {
          return failureCount < 2
        }
        return false
      },
    },
  },
})

export const ApiProvider: PComp = p => <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
