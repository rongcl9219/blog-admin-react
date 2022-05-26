import React from 'react';
import Header from './Header';
import Aside from './Aside';
import AppMain from './AppMain';
import Footer from './Footer';
import './layout.less';

const Layout = () => (
    <div className="app-wrap">
        <Aside />
        <section className="main-container">
            <Header />
            <AppMain />
            <Footer />
        </section>
    </div>
);

export default Layout;
