import { css as emotionCss, CSSInterpolation, cx as emotionCx } from '@emotion/css'

// eslint-disable-next-line no-underscore-dangle
const _space = { xxs: '0.25rem', xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' }

export const space = Object.assign(
  (...args: (0 | '0' | keyof typeof _space)[]) => args.map(s => (s === 0 || s === '0' ? '0' : _space[s])).join(' '),
  _space
)

// Allows both style objects and emotion-generated classnames to be merged in a specified order
export const css = (...classes: (CSSInterpolation | string)[]) =>
  emotionCx(...classes.map(c => (typeof c === 'string' ? c : emotionCss(c))))
