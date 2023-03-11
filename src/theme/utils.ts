import tinyColor from 'tinycolor2'

export const fade = (color: string, alpha: number): string => tinyColor(color).setAlpha(alpha).toHexString()

export const lighten = (color: string, light: number): string => tinyColor(color).lighten(light).toHexString()

export const darken = (color: string, dark: number): string => tinyColor(color).darken(dark).toHexString()
