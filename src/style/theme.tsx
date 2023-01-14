import { css as emotionCss, CSSInterpolation, cx as emotionCx } from '@emotion/css'
import { mix, transparent } from 'helpers/color'

// FIXME: figure out a way to toggle dark mode
let isDarkMode = false

const colors = {
  primary: { dark: '#00C65E', light: '#00C65E' },
  secondary: { dark: '#0057B8', light: '#0057B8' },
  info: { dark: '#0D91FD', light: '#0D91FD' },
  success: { dark: '#0AD651', light: '#0AD651' },
  warning: { dark: '#FFD800', light: '#FFD800' },
  danger: { dark: '#FF2E47', light: '#FF2E47' },
  background: { dark: ['#575762'], light: ['#FFFFFF'] },
  text: { dark: '#FEFEFF', light: '#1F1F1F' },
}
const space = { xxs: '0.25rem', xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' }
const shadow = {
  1: [
    { offsetX: 0, offsetY: 1, blur: 2, spread: 0, transparency: 0.03 },
    { offsetX: 0, offsetY: 2, blur: 4, spread: 0, transparency: 0.04 },
    { offsetX: 0, offsetY: 6, blur: 9, spread: -1, transparency: 0.2 },
    { offsetX: 0, offsetY: -2, blur: 4, spread: -4, transparency: 0.2 },
  ],
  2: [
    { offsetX: 0, offsetY: 4, blur: 8, spread: 0, transparency: 0.03 },
    { offsetX: 0, offsetY: 8, blur: 16, spread: -2, transparency: 0.04 },
    { offsetX: 0, offsetY: 24, blur: 36, spread: -4, transparency: 0.2 },
    { offsetX: 0, offsetY: -2, blur: 4, spread: -4, transparency: 0.2 },
  ],
  3: [
    { offsetX: 0, offsetY: 12, blur: 24, spread: 0, transparency: 0.03 },
    { offsetX: 0, offsetY: 24, blur: 48, spread: -6, transparency: 0.04 },
    { offsetX: 0, offsetY: 72, blur: 108, spread: -12, transparency: 0.2 },
    { offsetX: 0, offsetY: -2, blur: 4, spread: -4, transparency: 0.2 },
  ],
}

const buildColors = (clrs: typeof colors, isDrkMd: boolean) => {
  const { background: backgroundColor, ...other } = clrs
  type OtherColors = typeof other
  type GeneratedOtherColors = Record<
    keyof OtherColors,
    ((transparency?: number) => string) & {
      dark: (transparency?: number) => string
      light: (transparency?: number) => string
    }
  >

  const transparencyFn = (c: string, tr?: number) => (tr !== undefined ? transparent(c, tr) : c)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const colorFunctions = (Object.keys(other) as (keyof OtherColors)[]).reduce<GeneratedOtherColors>(
    (res, k) => {
      res[k] = Object.assign(
        (transparency?: number) => transparencyFn(isDrkMd ? other[k].dark : other[k].light, transparency),
        {
          dark: (transparency?: number) => transparencyFn(other[k].dark, transparency),
          light: (transparency?: number) => transparencyFn(other[k].light, transparency),
        }
      )
      return res
    },
    // eslint-disable-next-line
    {} as GeneratedOtherColors
  )

  const backgroundMixFn = (bgs: string[], elevation: number) => {
    elevation = Math.max(0, Math.min(1, elevation))

    if (elevation === 0) return bgs[0]
    if (elevation === 1) return bgs[bgs.length - 1]

    const bg0Index = Math.floor((bgs.length - 1) * elevation)
    const bg1Index = Math.min(bg0Index + 1, bgs.length - 1)
    const bg0 = bgs[bg0Index]
    const bg1 = bgs[bg1Index]
    const displacement = (elevation - bg0Index / (bgs.length - 1)) * (bgs.length - 1)

    return mix(bg0, bg1, displacement)
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const backgroundDark = (elevation: number, transparency?: number) =>
    transparencyFn(backgroundMixFn(backgroundColor.dark, elevation), transparency)
  const backgroundLight = (elevation: number, transparency?: number) =>
    transparencyFn(backgroundMixFn(backgroundColor.light, elevation), transparency)

  const background = Object.assign(
    (elevation: number, transparency?: number) =>
      transparencyFn(isDrkMd ? backgroundDark(elevation) : backgroundLight(elevation), transparency),
    { dark: backgroundDark, light: backgroundLight }
  )

  return {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ...(Object.keys(other) as (keyof OtherColors)[]).reduce<GeneratedOtherColors>((res, k) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
      res[k] = other[k][isDrkMd ? 'dark' : 'light'] as any
      return res
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/prefer-reduce-type-parameter
    }, {} as GeneratedOtherColors),
    ...colorFunctions,
    background,
  }
}

export const theme = {
  colors: buildColors(colors, isDarkMode),

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  shadow: (Object.keys(shadow) as unknown as (keyof typeof shadow)[]).reduce<Record<keyof typeof shadow, string>>(
    (res, key) => {
      res[key] = shadow[key].reduce<string>((s, { offsetX, offsetY, blur, spread, transparency }) => {
        const sh = s ? `${s}, ` : ''
        // 2x transparecy when in dark mode makes shadows darker (more visible) on the darker background
        const alpha = isDarkMode ? transparency * 2 : transparency
        return `${sh}${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha})`
      }, '')
      return res
    },
    {} as any // eslint-disable-line
  ),

  space: () =>
    Object.assign(
      (...args: (0 | '0' | keyof typeof space)[]) => args.map(s => (s === 0 || s === '0' ? '0' : space[s])).join(' '),
      space
    ),

  font: {
    size: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem', lg: '1.25rem', xl: '1.75rem', xxl: '2rem' },
    weight: { light: 200, normal: 300, semibold: 500, bold: 700 },
  },

  icon: { xs: '0.75rem', sm: '1rem', md: '1.25rem', lg: '1.75rem' },
}

// Allows both style objects and emotion-generated classnames to be merged in a specified order
export const css = (...classes: (CSSInterpolation | string)[]) =>
  emotionCx(...classes.map(c => (typeof c === 'string' ? c : emotionCss(c))))
