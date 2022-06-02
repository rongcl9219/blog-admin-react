import React, { Suspense, lazy } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import Nprogress from '@/components/Nprogress';

const Layout = lazy(() => import(/* webpackChunkName: "admin-layout" */ '@/components/layout'));
const AdminMain = lazy(() => import(/* webpackChunkName: "admin-main" */ '@/views/Main'));
const AdminClass = lazy(() => import(/* webpackChunkName: "admin-class" */ '@/views/Class'));
const AdminTag = lazy(() => import(/* webpackChunkName: "admin-tag" */ '@/views/Tag'));
const AdminArticle = lazy(() => import(/* webpackChunkName: "admin-article" */'@/views/Article'));
const AdminWebInfo = lazy(() => import(/* webpackChunkName: "admin-webInfo" */'@/views/WebInfo'));
const AdminIcons = lazy(() => import(/* webpackChunkName: "admin-icons" */ '@/views/Icons'));
const ArticleView = lazy(() => import(/* webpackChunkName: "admin-articleView" */ '@/views/ArticleView'));
const Login = lazy(() => import(/* webpackChunkName: "admin-login" */ '@/views/Login'));
const RefuseError = lazy(() => import(/* webpackChunkName: "admin-refuseError" */ '@/views/RefuseError'));
const NotFound = lazy(() => import(/* webpackChunkName: "admin-notFound" */ '@/views/NotFound'));

interface Meta {
    auth?: boolean;
    title?: string;
}

interface RouterItem extends RouteObject {
    meta?: Meta;
    children?: RouterItem[];
}

const routes: Array<RouterItem> = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <AdminMain /> },
            { path: 'class', element: <AdminClass />, meta: { auth: true, title: '分类' } },
            { path: 'tag', element: <AdminTag />, meta: { auth: true, title: '标签' } },
            { path: 'article', element: <AdminArticle />, meta: { auth: true, title: '文章' } },
            { path: 'webInfo', element: <AdminWebInfo />, meta: { auth: true, title: '网站信息' } },
            { path: 'icons', element: <AdminIcons />, meta: { auth: true, title: '图标' } },
            { path: 'articleView', element: <ArticleView />, meta: { auth: true } }
        ],
        meta: { auth: true, title: '首页' }
    },
    { path: '/login', element: <Login /> },
    { path: '/403', element: <RefuseError /> },
    { path: '*', element: <NotFound /> }
];

// 路由处理方式
const generateRouter = (routers: Array<RouterItem>) => routers.map((item) => {
    let newItem = item;
    if (newItem.children) {
        newItem.children = generateRouter(newItem.children);
    }
    return newItem;
});

function Routes() {
    return useRoutes(generateRouter(routes));
}

const RouteView = () => (
    <Suspense fallback={<Nprogress />}>
        <Routes />
    </Suspense>
);

//根据路径获取路由
const checkAuth = (routers: Array<RouterItem>, path: string, pPath?: string): RouterItem | null => {
    for (let i = 0; i < routers.length; i++) {
        const route = routers[i];
        let routePath = path;
        if (pPath) {
            routePath = `${pPath === '/' ? '' : path }/${ path }`;
        }
        if (routePath === path) { return route; }
        if (route.children) {
            const res: RouterItem | null = checkAuth(route.children, path, routePath);
            if (res) { return res; }
        }
    }
    return null;
};

const checkRouterAuth = (path: string): RouterItem | null => {
    let auth = null;
    auth = checkAuth(routes, path);
    return auth;
};

export { RouteView, checkRouterAuth, routes };
