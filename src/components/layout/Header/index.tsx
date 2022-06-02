import React from 'react';
import './style.less';
import Hamburger from './components/Hamburger';
import BreadcrumbNav from './components/Breadcrumb';

const Header = () => (
    <header className="header">
        <Hamburger />
        <BreadcrumbNav />
    </header>
);

export default Header;
