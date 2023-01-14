/* @refresh reload */
import { ApiProvider } from 'api/ApiProvider'
import { render } from 'solid-js/web'
import { loadGlobalCss } from 'style/global'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found.')

loadGlobalCss()

render(
  () => (
    <ApiProvider>
      <App />
    </ApiProvider>
  ),
  root
)
