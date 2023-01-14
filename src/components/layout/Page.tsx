import { css } from 'style/theme'
import { PComp } from 'types/utils'
import { Col } from './Layout'

export const Page: PComp = p => {
  return <Col class={css({ position: 'absolute', inset: 0 })}>{p.children}</Col>
}
