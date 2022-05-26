import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '@/redux/store';
import { RouteView } from '@/router';
import '@/style/reset.less';
import '@/style/app.less';
import '@/svg';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <RouteView />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
