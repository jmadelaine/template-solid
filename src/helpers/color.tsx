import chroma from 'chroma-js'

export const mix = (color0: string, color1: string, ratio = 0.5) => chroma(color0).mix(color1, ratio).hex()
export const darken = (color: string, amount?: number) => chroma(color).darken(amount).hex()
export const lighten = (color: string, amount?: number) => chroma(color).brighten(amount).hex()
export const contrast = (color: string) => {
  const l = chroma(color).luminance()
  return l < 0.08 ? '#FEFEFF' : l < 0.55 ? '#ffffff' : '#1F1F1F'
}
export const transparent = (color: string, amount: number) => `rgba(${chroma(color).alpha(amount).rgba().join(',')})`
