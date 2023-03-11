import React, { FC, useState } from 'react'
import { Menu, Dropdown, Space, Avatar } from 'antd'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { CaretDownOutlined } from '@ant-design/icons'
import defaultUserImg from '@/assets/images/default_img/default_user.png'
import ModifyPwd from './ModifyPwd'
import ModifyUserInfo from './ModifyUserInfo'
import './userInfo.less'

interface IProps {
    avatar?: string
}

const UserInfo: FC<IProps> = ({ avatar }) => {
    const [isModifyPwdVisible, changeModifyPwdVisible] = useState(false)
    const [isModifyUserVisible, changeModifyUserVisible] = useState(false)

    const navigate = useNavigate()

    const handleLoginOut = () => {
        navigate('/login', {
            replace: true
        })
    }

    const menu = (
        <Menu
            items={[
                {
                    label: <a onClick={() => changeModifyUserVisible(true)}>个人信息</a>,
                    key: '0'
                },
                {
                    label: <a onClick={() => changeModifyPwdVisible(true)}>修改密码</a>,
                    key: '1'
                },
                {
                    type: 'divider'
                },
                {
                    label: <a onClick={handleLoginOut}>退出</a>,
                    key: '3'
                }
            ]}
        />
    )
    return <>
        <Dropdown overlayClassName="avatar-dropdown" placement="bottomRight" className="avatar-container" overlay={menu} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
                <Space>
                    <Avatar src={avatar || defaultUserImg} shape="square" size={40} />
                    <CaretDownOutlined />
                </Space>
            </a>
        </Dropdown>
        <ModifyPwd visible={isModifyPwdVisible} showModal={changeModifyPwdVisible} />
        <ModifyUserInfo visible={isModifyUserVisible} showModal={changeModifyUserVisible} />
    </>
}

UserInfo.defaultProps = {
    avatar: ''
}

export default connect((state: IGlobalState) => ({
    avatar: state.UserReducer.avatar
}))(UserInfo)
