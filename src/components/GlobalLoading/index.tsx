import React, { FC } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './globalLoading.less'

interface IProps {
    loadingTips?: string;
}

const GlobalLoading: FC<IProps> = ({loadingTips }) => <div className="global-loading">
    <Spin indicator={<LoadingOutlined />} tip={loadingTips || ''} />
</div>

GlobalLoading.defaultProps = {
    loadingTips: ''
}

export default GlobalLoading
