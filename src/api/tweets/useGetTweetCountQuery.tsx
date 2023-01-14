import { doRequest } from 'api/doRequest'
import { Config } from 'api/types'
import { useQuery } from 'api/useQuery'
import { createQueryId } from 'api/utils'
import { assertThat, is } from 'ts-guardian'

const isResponse = is({ userId: 'number', id: 'number', title: 'string', completed: 'boolean' })

export const useGetTodoQuery = (config: Config<{ todoId: string }>) =>
  useQuery({
    errorMessage: config().errorMessage,
    id: createQueryId('getTodos', config().todoId),
    handler: async () => {
      const res = await doRequest({
        url: `https://jsonplaceholder.typicode.com/todos/${config().todoId}`,
        method: 'get',
      })
      assertThat(res, isResponse)
      return res
    },
  })
