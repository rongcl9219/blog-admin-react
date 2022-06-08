import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Header from './Header';
import Aside from './Aside';
import AppMain from './AppMain';
import Footer from './Footer';
import './layout.less';

const Layout: FC<CommonState> = ({ globalLoading, loadingTips }) => (
    <Spin spinning={globalLoading} indicator={<LoadingOutlined />} tip={loadingTips} wrapperClassName="global-loading">
        <div className="app-wrap">
            <Aside />
            <section className="main-container">
                <Header />
                <AppMain />
                <Footer />
            </section>
        </div>
    </Spin>
);

export default connect((state: IGlobalState) => ({
    globalLoading: state.CommonReducer.globalLoading,
    loadingTips: state.CommonReducer.loadingTips
}))(Layout);
