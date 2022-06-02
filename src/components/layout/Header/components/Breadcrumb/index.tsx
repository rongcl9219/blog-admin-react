import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { routes } from '@/router';
import { Breadcrumb } from 'antd';
import './breadcrumb.less';

const getBreadcrumbArr = (routeArr: Array<any>, path?: string): Record<string, string> => routeArr.reduce((pre, cur) => {
    let newArr = pre;
    if (cur.meta && cur.meta.title) {
        let routePath = cur.path;
        if (path) {
            routePath = `${path === '/' ? '' : path }/${ routePath }`;
        }
        newArr[routePath] = cur.meta.title;
    }
    if (cur.children) {
        const arr = getBreadcrumbArr(cur.children, cur.path);
        newArr = { ...newArr, ...arr };
    }
    return newArr;
}, {});

const breadcrumbNameMap = getBreadcrumbArr(routes);

const BreadcrumbNav = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">首页</Link>
        </Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);

    return <Breadcrumb className="breadcrumb-container">{breadcrumbItems}</Breadcrumb>;
};

export default BreadcrumbNav;
