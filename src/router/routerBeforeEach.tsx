import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
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
        let blLogin = sessionStorage.getItem('login');
        if (obj && obj.meta?.auth && blLogin === 'false') {
            setAuth(false);
            navigate('/login', { replace: true });
        } else {
            setAuth(true);
        }
        Nprogress.done();
    }, [location.pathname, navigate]);
    return auth ? <Outlet /> : null;
};

export default RouterBeforeEach;
