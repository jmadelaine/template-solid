import { useGetTodoQuery } from 'api/tweets/useGetTweetCountQuery'
import { Col } from 'components/layout/Layout'
import { createSignal } from 'solid-js'
import { PComp } from 'types/utils'

export const App: PComp = () => {
  const [todoId, setTodoId] = createSignal(1)

  const getTodoQuery = useGetTodoQuery(() => ({ todoId: String(todoId()) }))

  return (
    <Col class={css({ backgroundColor: todoId() % 2 === 0 ? 'red' : 'yellow' })}>
      <button
        onClick={async () => {
          await getTodoQuery()
          setTodoId(todoId() + 1)
        }}
      >
        {'fetch'}
      </button>
      <div>{getTodoQuery.data?.title}</div>
    </Col>
  )
}
