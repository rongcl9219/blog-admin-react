import React, { FC } from 'react';
import { connect } from 'react-redux';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import './hamburger.less';
import { toggleMenu } from '@/redux/reducers/common/actions';

interface CommonRedux extends CommonState {
    toggleAsideMenu: () => void
}

const Hamburger: FC<CommonRedux> = ({ menuOpen, toggleAsideMenu }) => {
    const onClick = () => {
        toggleAsideMenu();
    };

    const iconStyle = {
        fontSize: '20px'
    };

    return (
        <div className="hamburger">
            {
                menuOpen ? <MenuUnfoldOutlined style={iconStyle} onClick={onClick} /> : <MenuFoldOutlined style={iconStyle} onClick={onClick} />
            }
        </div>
    );
};

export default connect((state: IGlobalState) => ({
    menuOpen: state.CommonReducer.menuOpen
}), {
    toggleAsideMenu: toggleMenu
})(Hamburger);
