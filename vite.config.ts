import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteCompression from 'vite-plugin-compression'

const pathResolve = (pathStr: string): string => resolve(__dirname, '.', pathStr)

/**
 * gzip 压缩
 */
const viteCompressionOptions = {
    filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
    threshold: 1024, // 文件容量大于这个值进行压缩
    //algorithm: 'gzip', // 压缩方式
    ext: 'gz', // 后缀名
    deleteOriginFile: false // 压缩后是否删除压缩源文件
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {

    let buildPlugins = []
    if (command === 'build') {
        buildPlugins.push(viteCompression(viteCompressionOptions))
    }

    return {
        resolve: {
            alias: {
                '@': pathResolve('src')
            }
        },
        plugins: [
            react(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: '火星的青青草原'
                    }
                }
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [pathResolve('src/svg/icons'), pathResolve('src/svg/emoji')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]'
            }),
            ...buildPlugins
        ],
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        }
    }
})
