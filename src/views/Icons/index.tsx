import React from 'react'
import { Tabs, Card, Tooltip } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { QuestionCircleFilled } from '@ant-design/icons'
import clipboard from '@/utils/clipboard'
import iconList from './icons'
import './icon.less'

interface IIconProps {
    iconClass: string;
}

const handleClipboard = (text: string, event: React.MouseEvent): void => {
    clipboard(text, event)
}

const IconItem: React.FC<IIconProps> = ({iconClass}) => {
    const generateIconCode = `<SvgIcon iconClass="${iconClass}" />`

    return <div className="grid-item">
        <SvgIcon iconClass={iconClass} />
        <p>{iconClass}</p>
        <div className="icon-cover" onClick={(event) => handleClipboard(generateIconCode, event)} />
    </div>
}

const IconsAdmin = () => (
    <Card>
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={<span>
                <span style={{marginRight: '5px'}}>Icons</span>
                <Tooltip title="使用前先引入组件 import SvgIcon from '@/components/SvgIcon';">
                    <QuestionCircleFilled />
                </Tooltip>
            </span>} key="1">
                <div className="icon-grid scrollBar">
                    {
                        iconList.map((key) => <IconItem key={key} iconClass={key} />)
                    }
                </div>
            </Tabs.TabPane>
        </Tabs>
    </Card>
)

export default IconsAdmin
