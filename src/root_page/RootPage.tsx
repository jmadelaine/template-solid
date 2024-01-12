import { Button } from 'components/input/Button'
import { Col } from 'components/layout/Layout'
import { Page } from 'components/layout/Page'
import { createEffect, createSignal } from 'solid-js'
import { css, theme } from 'style/theme'
import { Comp, PComp } from 'types/utils'

export const RootPage: Comp = () => {
  const [clickCount, setClickCount] = createSignal(0)

  // eslint-disable-next-line no-console
  createEffect(() => console.log(`Clicked: ${clickCount()}`))

  return (
    <Page>
      <Col align="center" distribute="center" gap="1rem" flex={1}>
        <MyButton onClick={() => setClickCount(v => v + 1)}>
          {clickCount() ? `Clicked ${clickCount()}` : 'Click me'}
        </MyButton>
      </Col>
    </Page>
  )
}

const MyButton: PComp<{ onClick: () => void }> = p => {
  return (
    <Button
      class={css({
        width: '12rem',
        height: '4rem',
        color: '#fff',
        backgroundColor: theme.colors.primary(4),
        borderRadius: '0.375rem',
        fontSize: theme.font.size.lg,
      })}
      onClick={() => p.onClick()}
    >
      {p.children}
    </Button>
  )
}
