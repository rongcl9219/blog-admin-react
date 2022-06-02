import { cacheAccessToken } from '@/core/cookieCache';
import { cacheRefreshToken, cacheTokenExp } from '@/core/storageCache';
import { SET_AVATAR, SET_TOKEN_INFO, SET_USER_INFO } from './types';

const UserReducer = (
    state: UserState = {
        username: '',
        avatar: '',
        token: cacheAccessToken.load() || '',
        refreshToken: cacheRefreshToken.load() || '',
        tokenExp: cacheTokenExp.load() || 0
    },
    action: IAction<any> = { type: '' }
) => {
    const { type, payload } = action;

    switch (type) {
    case SET_TOKEN_INFO: {
        const { accessToken, refreshToken, exp } = payload;
        return { ...state, token: accessToken, refreshToken: refreshToken, tokenExp: exp };
    }
    case SET_USER_INFO: {
        const { userName, avatarUrl } = payload;
        return { ...state, username: userName, avatar: avatarUrl };
    }
    case SET_AVATAR:
        return { ...state, avatar: payload.avatarUrl };
    default:
        return state;
    }
};

export default UserReducer;
