import React, { FC } from 'react';
import { connect } from 'react-redux';
import './aside.less';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import { useNavigate, useLocation } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('主页', '/', <SvgIcon iconClass='home-page' />),
    getItem('分类管理', 'class', <SvgIcon iconClass='class-manage' />),
    getItem('标签管理', 'tag', <SvgIcon iconClass='tag' />),
    getItem('文章管理', 'article', <SvgIcon iconClass='article-manage' />),
    getItem('网站信息', 'webInfo', <SvgIcon iconClass='heart' />),
    getItem('图标', 'icons', <SvgIcon iconClass='icon-img' />)
];

const Aside: FC<CommonState> = ({ menuOpen }) => {
    const navigate = useNavigate();
    const onClick: MenuProps['onClick'] = e => {
        navigate(e.key);
    };

    const location = useLocation();

    const activeKey = (): string[] => {
        let arr: string[] = [];
        const pathname = location.pathname.replace('/', '');
        arr.push(pathname || '/');
        return arr;
    };

    return (
        <aside className="aside-container">
            <Menu
                onClick={onClick}
                selectedKeys={activeKey()}
                mode="inline"
                inlineCollapsed={ menuOpen }
                items={items}
            />
        </aside>
    );
};

export default connect((state: IGlobalState) => ({
    menuOpen: state.CommonReducer.menuOpen
}))(Aside);
