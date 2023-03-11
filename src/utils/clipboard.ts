import React from 'react'
import Clipboard from 'clipboard'
import { message } from 'antd'

const clipboardSuccess = (): void => {
    message.success('复制成功', 1.5).then()
}

const clipboardError = (): void => {
    message.error('复制失败', 1.5).then()
}

const handleClipboard = (text: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    const clipboard: any = new Clipboard(target, {
        text: () => text
    })
    clipboard.on('success', () => {
        clipboardSuccess()
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        clipboardError()
        clipboard.destroy()
    })
    clipboard.onClick(event)
}

export default handleClipboard
