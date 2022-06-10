import React, { FC } from 'react';
import { connect } from 'react-redux';
import GlobalLoading from '@/components/GlobalLoading';
import Header from './Header';
import Aside from './Aside';
import AppMain from './AppMain';
import Footer from './Footer';
import './layout.less';

const Layout: FC<CommonState> = ({ globalLoading, loadingTips }) => <>
    { globalLoading ? <GlobalLoading loadingTips={loadingTips} /> : null }
    <div className="app-wrap">
        <Aside />
        <section className="main-container">
            <Header />
            <AppMain />
            <Footer />
        </section>
    </div>
</>;

export default connect((state: IGlobalState) => ({
    globalLoading: state.CommonReducer.globalLoading,
    loadingTips: state.CommonReducer.loadingTips
}))(Layout);
