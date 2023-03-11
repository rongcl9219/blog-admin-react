import { cacheThemeInfo } from '@/core/storageCache'
import colorPalette from '@/theme/colorPalette'
import { fade, lighten, darken } from './utils'

// 变量前缀
const primary = '--ant-primary'

const themeInfo = cacheThemeInfo.load() || null

/**
 * 设置本地主题
 */
export const themeColor = themeInfo ? themeInfo.primaryColor : null

/**
 * 加载本地主题
 */
export const initTheme = () => {
    const style = themeInfo && themeInfo.themeStyle
    document.documentElement.style.cssText = style || ''
}

/**
 * @description 设置主题
 * @param color 16进制色值
 */
export const setTheme = (color: string) => {
    const node = document.documentElement
    // 主要颜色
    node.style.setProperty(`${primary}-color`, color)
    node.style.setProperty(`${primary}-color-hover`, colorPalette(color, 5))
    node.style.setProperty(`${primary}-color-active`, colorPalette(color, 7))
    node.style.setProperty(`${primary}-color-outline`, fade(color, 0.2))
    const primary1 = colorPalette(color, 1)
    node.style.setProperty(`${primary}-1`, primary1)
    node.style.setProperty(`${primary}-2`, colorPalette(color, 2))
    node.style.setProperty(`${primary}-3`, colorPalette(color, 3))
    node.style.setProperty(`${primary}-4`, colorPalette(color, 4))
    node.style.setProperty(`${primary}-5`, colorPalette(color, 5))
    node.style.setProperty(`${primary}-6`, color)
    node.style.setProperty(`${primary}-7`, colorPalette(color, 7))
    node.style.setProperty(`${primary}-color-deprecated-l-35`, lighten(color, 0.35))
    node.style.setProperty(`${primary}-color-deprecated-l-20`, lighten(color, 0.2))
    node.style.setProperty(`${primary}-color-deprecated-t-20`, color)
    node.style.setProperty(`${primary}-color-deprecated-t-50`, color)
    node.style.setProperty(`${primary}-color-deprecated-f-12`, fade(color, 0.12))
    node.style.setProperty(`${primary}-color-active-deprecated-f-30`, fade(primary1, 0.3))
    node.style.setProperty(`${primary}-color-active-deprecated-d-02`, darken(primary1, 0.02))

    // 本地缓存style，样式持久化，你也可以存在后端
    cacheThemeInfo.save({
        primaryColor: color,
        themeStyle: node.style.cssText
    })
    window.location.reload()
}
