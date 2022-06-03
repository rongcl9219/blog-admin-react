import React, { FC } from 'react';
import { Menu, Dropdown, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { CaretDownOutlined } from '@ant-design/icons';
import defaultUserImg from '@/assets/images/default_img/default_user.png';
import './userInfo.less';

interface IProps {
    avatar?: string
}

const UserInfo: FC<IProps> = ({ avatar }) => {
    const navigate = useNavigate();

    const handleLoginOut = () => {
        navigate('/login', {
            replace: true
        });
    };

    const menu = (
        <Menu
            items={[
                {
                    label: <a>个人信息</a>,
                    key: '0'
                },
                {
                    label: <a>修改密码</a>,
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
    );

    return <Dropdown overlayClassName="avatar-dropdown" placement="bottomRight" className="avatar-container" overlay={menu} trigger={['click']}>
        <a onClick={e => e.preventDefault()}>
            <Space>
                <Avatar src={avatar} shape="square" size={40} />
                <CaretDownOutlined />
            </Space>
        </a>
    </Dropdown>;
};

UserInfo.defaultProps = {
    avatar: defaultUserImg
};

export default connect((state: IGlobalState) => ({
    avatar: state.UserReducer.avatar
}))(UserInfo);