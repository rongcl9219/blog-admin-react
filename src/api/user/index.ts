import HttpRequest from '@/core/request/http';
import { UserInfo, UpdatePass } from './types';

/**
 * @description 用户接口
 */
class UserApi extends HttpRequest {
    /**
     * 登录
     * @param username
     * @param password
     */
    login(username: string, password: string) {
        return this.fetchPost({
            url: '/login',
            data: { username, password }
        });
    }

    /**
     * 退出登录
     */
    loginOut() {
        return this.fetchPost({
            url: '/loginOut'
        });
    }

    /**
     * 获取登录用户信息
     */
    getUserInfo() {
        return this.fetchGet({
            url: '/admin/getUserInfo'
        });
    }

    /**
     * 修改密码
     * @param updatePass
     */
    updatePassword(updatePass: UpdatePass) {
        return this.fetchPost({
            url: '/admin/updatePassword',
            data: updatePass
        });
    }

    /**
     * 修改用户信息
     * @param userInfo
     */
    updateUserInfo(userInfo: UserInfo) {
        return this.fetchPost({
            url: '/admin/updateUserInfo',
            data: userInfo
        });
    }

    /**
     * 初始化后台管理员
     */
    initSysAdmin() {
        return this.fetchPost({
            url: '/initAdmin'
        });
    }
}

let instance;

export default (function () {
    if (instance) {
        return instance;
    }
    instance = new UserApi();
    return instance;
})();
