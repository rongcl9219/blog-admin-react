import { CommonApi, UserApi } from '@/api';
import { cacheAccessToken } from '@/core/cookieCache';
import { cacheRefreshToken, cacheTokenExp } from '@/core/storageCache';
import { SET_TOKEN_INFO, SET_USER_INFO, SET_AVATAR } from './types';

interface ITokenInfo {
    accessToken: string;
    refreshToken: string;
    exp: number;
}

interface IUserInfo {
    userName: string;
    avatarUrl: string;
}

/**
 * 设置token信心
 * @param tokenInfo
 */
export const setToken = (tokenInfo: ITokenInfo): Promise<IAction<ITokenInfo>> =>
    new Promise((resolve) => {
        const { accessToken, refreshToken, exp } = tokenInfo;
        const dateNow = new Date().getTime();
        const tokenExpireTime = dateNow + exp;
        cacheAccessToken.save(accessToken);
        cacheRefreshToken.save(refreshToken);
        cacheTokenExp.save(tokenExpireTime);
        resolve({
            type: SET_TOKEN_INFO,
            payload: { ...tokenInfo, exp: tokenExpireTime }
        });
    });

/**
 * 清除token信心
 */
export const clearToken = (): Promise<IAction<ITokenInfo>> =>
    new Promise((resolve) => {
        cacheAccessToken.delete();
        cacheRefreshToken.delete();
        cacheTokenExp.delete();
        resolve({
            type: SET_TOKEN_INFO,
            payload: {
                accessToken: '',
                refreshToken: '',
                exp: 0
            }
        });
    });

export const setUserAvatar = (avatarUrl: string): IAction<{ avatarUrl: string }> => ({
    type: SET_AVATAR,
    payload: {
        avatarUrl
    }
});

/**
 * 设置用户信息
 * @param userInfo
 */
export const setUserInfo = (userInfo: IUserInfo): Promise<IAction<IUserInfo>> =>
    new Promise((resolve) => {
        resolve({
            type: SET_USER_INFO,
            payload: userInfo
        });
    });

/**
 * 刷新token
 */
export const getRefreshToken = (dispatch: (action: any) => void): Promise<any> =>
    CommonApi.refreshToken().then((res) => dispatch(setToken(res.data)));

/**
 * 用户登录
 */
export const userLogin = (dispatch: any): (username: string, password: string) => Promise<any> => (username: string, password: string): Promise<any> =>
    UserApi.login(username, password).then((res) => {
        dispatch(setToken(res.data));
    });

/**
 * 用户退出登录
 */
export const userLoginOut = (dispatch: any): () => Promise<any> => () => UserApi.loginOut().then(() => {
    dispatch(clearToken());
    dispatch(setUserInfo({
        userName: '',
        avatarUrl: ''
    }));
});

/**
 * 获取用户信息
 */
export const getUserInfo = (dispatch: (action: any) => void): void => {
    UserApi.getUserInfo().then((response) => {
        dispatch(setUserInfo(response.data.userInfo));
    });
};
