import React from 'react';
import './style.less';
import Hamburger from './components/Hamburger';
import BreadcrumbNav from './components/Breadcrumb';
import UserInfo from './components/UserInfo';
import ThemePicker from './components/ThemePicker';

const Header = () => (
    <header className="header">
        <Hamburger />
        <BreadcrumbNav />
        <div className="nav-right">
            <ThemePicker />
            <UserInfo />
        </div>
    </header>
);

export default Header;
