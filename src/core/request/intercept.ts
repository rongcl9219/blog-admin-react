/**
 * @description 拦截器
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import store from '@/redux/store';
import { getRefreshToken } from '@/redux/reducers/user/actions';

// axios实例
const instance = axios.create({
    timeout: 5000
});

// 是否正在刷新token
let isRefreshing: boolean = false;
// 请求列表
let requestList: Array<any> = [];

instance.interceptors.request.use(
    (request: AxiosRequestConfig) => {
        const timestamp = new Date().getTime();
        // 添加时间戳

        // 添加请求头token
        const { token, refreshToken, tokenExp } = store.getState().UserReducer;

        request.params = {
            _: timestamp,
            ...request.params
        };

        if (/^(\/admin)/.test(request.url || '')) {
            if (token && tokenExp) {
                const dateNow = new Date().getTime();

                // token过期
                if (dateNow >= tokenExp) {
                    if (!isRefreshing) {
                        isRefreshing = true;

                        getRefreshToken(store.dispatch).then(() => {
                            isRefreshing = false;
                            requestList.forEach((cb) => cb());
                            requestList = [];
                        }).catch(() => {
                            requestList = [];
                            isRefreshing = false;
                            window.location.href = '/403';
                        });
                    }

                    // 正在刷新token，返回一个未执行resolve的promise
                    return new Promise((resolve) => {
                        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                        requestList.push(() => {
                            resolve(request);
                        });
                    });
                }
            }
            return request;
        }

        if (request.url && request.url === '/refreshToken') {
            request.headers = {
                authorization: `Bearer ${refreshToken}`
            };
        }

        return request;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const {data} = response;

        if (!data.status) {
            if (data.code === -4001) {
                window.location.href = '/403';
            }
            return Promise.reject(response.data);
        }
        return response;
    },
    (error) => {
        message.error('请求失败').then();
        return Promise.reject(error);
    }
);

export default instance;
