import HttpRequest from '@/core/request/http';

/**
 * @description 网站信息接口
 */
class WebInfoApi extends HttpRequest {
    /**
     * 获取网站信息
     */
    getWebInfo() {
        return this.fetchGet({
            url: '/getWebInfo'
        });
    }

    /**
     * 保存网站信息
     * @param paramObj
     */
    saveWebInfo(paramObj: any) {
        return this.fetchPost({
            url: '/admin/saveWebInfo',
            data: paramObj
        });
    }
}

let instance;

export default (function () {
    if (instance) {
        return instance;
    }
    instance = new WebInfoApi();
    return instance;
})();
