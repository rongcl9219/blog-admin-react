import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '@/redux/store';
import { RouteView } from '@/router';
import '@/style/reset.less';
import '@/style/app.less';
import 'antd/dist/antd.variable.min.css';
import '@/svg';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider, message } from 'antd';
import { initTheme } from '@/theme/theme';

initTheme();

message.config({
    duration: 2,
    maxCount: 5,
    rtl: true
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ConfigProvider locale={zhCN}>
                <RouteView />
            </ConfigProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
