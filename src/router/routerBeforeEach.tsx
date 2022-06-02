import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import store from '@/redux/store';
import { getUserInfo } from '@/redux/reducers/user/actions';
import Nprogress from 'nprogress';
import { checkRouterAuth } from './index';
import 'nprogress/nprogress.css';

const RouterBeforeEach = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        Nprogress.start();
        let obj = checkRouterAuth(location.pathname);
        if (obj && obj.meta?.auth) {
            const { token, username } = store.getState().UserReducer;
            if (token) {
                setAuth(true);
                if (!username) {
                    getUserInfo(store.dispatch);
                }
            } else {
                setAuth(false);
                navigate('/login', { replace: true });
            }
        } else {
            setAuth(true);
        }
        Nprogress.done();
    }, [location.pathname, navigate]);
    return auth ? <Outlet /> : null;
};

export default RouterBeforeEach;
